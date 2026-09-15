"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { Sparkle } from "@/components/brand/logo";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputClass =
  "w-full rounded-2xl border border-white/80 bg-white/55 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur-md px-4 py-3.5 text-ink placeholder:text-dim transition-colors duration-300 focus:border-indigo-hi focus:outline-none aria-[invalid=true]:border-[#c8324a]";

export function ContactForm() {
  const root = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const { contextSafe } = useGSAP({ scope: root });
  const celebrate = contextSafe(() => {
    gsap.fromTo("[data-done]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8 });
    gsap.fromTo("[data-done-star]", { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 1, ease: "back.out(2)" });
  });

  const toggle = (title: string) =>
    setPicked((list) => (list.includes(title) ? list.filter((t) => t !== title) : [...list, title]));

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Please tell us your name.";
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "We need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email address doesn't look right.";
    if (String(data.get("message") ?? "").trim().length < 10) next.message = "A sentence or two about the project helps (10 characters minimum).";
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          services: picked,
          message: data.get("message"),
          website: data.get("website"), // honeypot
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong on our side.");
      setStatus("sent");
      requestAnimationFrame(celebrate);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong on our side.");
    }
  };

  if (status === "sent") {
    return (
      <div data-done className="flex flex-col items-start gap-6 rounded-[var(--radius-panel)] border border-line bg-surface-2 p-8 md:p-12" role="status">
        <span data-done-star className="inline-block">
          <Sparkle className="size-14 text-indigo" />
        </span>
        <h2 className="display-md">Message received.</h2>
        <p className="max-w-[46ch] text-lg text-mute">
          Thanks for reaching out. We reply to every enquiry within one working day, usually sooner.
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form ref={root} onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name
          </label>
          <input id="name" name="name" autoComplete="name" className={inputClass} {...field("name")} />
          {errors.name && (
            <p id="name-error" className="text-sm text-[#b42a41]">
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClass} {...field("email")} />
          {errors.email && (
            <p id="email-error" className="text-sm text-[#b42a41]">
              {errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Phone or WhatsApp <span className="text-dim">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-ink">
            Company <span className="text-dim">(optional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputClass} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium text-ink">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => {
            const on = picked.includes(s.title);
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.title)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                  on ? "border-indigo bg-indigo text-white" : "border-line-strong text-mute hover:border-ink hover:text-ink",
                )}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          About the project
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Goals, timeline, links to anything you like."
          className={cn(inputClass, "resize-y")}
          {...field("message")}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-[#b42a41]">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-[#c8324a]/30 bg-[#c8324a]/[0.06] p-4 text-sm text-ink">
          <WarningCircle weight="fill" className="mt-0.5 size-5 shrink-0 text-[#b42a41]" />
          <p>
            {serverError} You can also email us directly at{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
          {status === "sending" ? (
            <>
              <Sparkle className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <ArrowUpRight weight="bold" className="size-4" />
            </>
          )}
        </button>
        <p className="flex items-center gap-2 text-sm text-mute">
          <CheckCircle weight="fill" className="size-4 text-indigo-hi" />
          Reply within one working day
        </p>
      </div>
    </form>
  );
}
