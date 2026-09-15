import { NextResponse } from "next/server";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Enquiries go to every address in CONTACT_TO (comma separated).
const recipients = () =>
  (process.env.CONTACT_TO ?? "sahoojyotiranjan595@gmail.com,crayoratech@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Must be an address on a domain verified in Resend (e.g. "Crayora <hello@crayoratech.com>").
// resend.dev works without verification but only delivers to the Resend account owner.
const sender = () => process.env.RESEND_FROM ?? "Crayora Website <onboarding@resend.dev>";

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured.");
    return NextResponse.json({ error: "Our mail service isn't set up yet." }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "-"],
    ["Company", company || "-"],
    ["Services", services.join(", ") || "-"],
  ];

  const html = `<div style="font-family:system-ui,sans-serif;color:#0c1229">
<h2 style="margin:0 0 16px">New project enquiry</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#545a70">${k}</td><td><strong>${escape(v)}</strong></td></tr>`)
    .join("")}</table>
<p style="margin-top:20px;white-space:pre-wrap">${escape(message)}</p>
<p style="color:#545a70;font-size:12px">Sent from the contact form on crayoratech.com. Reply to this email to answer ${escape(name)} directly.</p>
</div>`;

  const payload = {
    from: sender(),
    reply_to: email,
    subject: `New enquiry from ${name}${company ? ` (${company})` : ""}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`,
    html,
  };

  // One email per inbox, so a single rejected address (e.g. while the sending
  // domain is still unverified in Resend) never loses the enquiry for the rest.
  const results = await Promise.allSettled(
    recipients().map(async (to) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, to: [to] }),
      });
      if (!res.ok) throw new Error(`${to}: ${res.status} ${await res.text()}`);
    }),
  );

  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("Contact form: Resend rejected an email", f.reason));
  if (failures.length === results.length) {
    return NextResponse.json({ error: "We couldn't send your message right now." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
