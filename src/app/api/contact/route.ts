import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const company = str(body.company, 120);
  const message = str(body.message, 5000);
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === "string").map((s) => s.slice(0, 60)).slice(0, 6)
    : [];

  if (!name || !email || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a short message." }, { status: 422 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.error("Contact form: EMAIL_USER / EMAIL_PASS are not configured.");
    return NextResponse.json({ error: "Our mail service isn't set up yet." }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "-"],
    ["Company", company || "-"],
    ["Services", services.join(", ") || "-"],
  ];

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Crayora website" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` (${company})` : ""}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`,
      html: `<h2>New project enquiry</h2><table>${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`)
        .join("")}</table><p>${escape(message).replace(/\n/g, "<br>")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: failed to send", error);
    return NextResponse.json({ error: "We couldn't send your message right now." }, { status: 500 });
  }
}
