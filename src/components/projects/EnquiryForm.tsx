"use client";
import { useId, useState, type FormEvent } from "react";
import { Bi } from "@/components/ui/Bi";
import { useLang } from "@/lib/i18n";
import { LINKS } from "@/lib/content";
import type { BiText } from "@/lib/projects";
import { ENQUIRY_LIMITS, validContact, type EnquiryRequest, type EnquiryResponse } from "@/lib/enquiry/types";

const T = {
  name: { ta: "உங்கள் பெயர்", en: "Your name" },
  contact: { ta: "மின்னஞ்சல் அல்லது தொலைபேசி", en: "Email or phone" },
  contactHint: { ta: "இதன் வழியே மட்டுமே பதில் தருவோம்.", en: "We'll only use it to reply." },
  organisation: { ta: "நிறுவனம் (விருப்பம்)", en: "Organisation (optional)" },
  interest: { ta: "எதைப் பற்றி?", en: "What about?" },
  message: { ta: "உங்கள் செய்தி", en: "Your message" },
  messageHint: {
    ta: "எந்தக் குழந்தையின் பெயரையோ விவரங்களையோ இங்கே எழுத வேண்டாம்.",
    en: "Please don't include any child's name or details here.",
  },
  adult: { ta: "எனக்கு 18 வயது நிரம்பிவிட்டது.", en: "I am 18 or older." },
  consent: {
    ta: "இந்த விசாரணைக்குப் பதில் அளிக்க மட்டுமே யாழி இந்த விவரங்களைப் பயன்படுத்தலாம்.",
    en: "Yazhi may use these details only to reply to this enquiry.",
  },
  send: { ta: "விசாரணையை அனுப்புக", en: "Send enquiry" },
  sending: { ta: "அனுப்புகிறோம்…", en: "Sending…" },
  sent: { ta: "நன்றி! உங்கள் விசாரணை எங்களுக்குக் கிடைத்தது.", en: "Thank you — we've received your enquiry." },
  reference: { ta: "குறிப்பு எண்", en: "Reference" },
  unconfigured: {
    ta: "விசாரணைப் பெட்டி இன்னும் இணைக்கப்படவில்லை — எதுவும் அனுப்பப்படவில்லை, எதுவும் சேமிக்கப்படவில்லை. Discord-இல் எங்களைத் தொடர்புகொள்க.",
    en: "Our enquiry inbox isn't connected yet — nothing was sent or stored. Please reach us on Discord.",
  },
  failed: { ta: "அனுப்ப முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயல்க.", en: "We couldn't send it. Please try again in a little while." },
  limited: { ta: "இங்கிருந்து பல விசாரணைகள் வந்துள்ளன — சில நிமிடங்கள் கழித்து முயல்க.", en: "Too many enquiries from here — please try again in a few minutes." },
  discord: { ta: "Discord-இல் சேருக", en: "Join the Discord" },
} satisfies Record<string, BiText>;

type Field = "name" | "contact" | "interest" | "message" | "adult" | "consent";
const FIELD_ERROR: Record<Field, BiText> = {
  name: { ta: "உங்கள் பெயரைத் தருக.", en: "Please give your name." },
  contact: { ta: "பதில் அனுப்பக்கூடிய மின்னஞ்சல் அல்லது தொலைபேசி எண்ணைத் தருக.", en: "Please give an email address or phone number we can reply to." },
  interest: { ta: "எதைப் பற்றி என்று தேர்ந்தெடுக.", en: "Please choose what it's about." },
  message: {
    ta: `${ENQUIRY_LIMITS.minMessage} முதல் ${ENQUIRY_LIMITS.message} எழுத்துகள் வரை எழுதுக.`,
    en: `Please write between ${ENQUIRY_LIMITS.minMessage} and ${ENQUIRY_LIMITS.message} characters.`,
  },
  adult: { ta: "விசாரணைகள் 18 வயது நிரம்பியவர்களுக்கு மட்டும்.", en: "Enquiries are for adults (18 and over)." },
  consent: { ta: "விவரங்களைப் பயன்படுத்த உங்கள் ஒப்புதல் தேவை.", en: "We need your agreement to use these details." },
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; reference: string }
  | { kind: "unconfigured" }
  | { kind: "limited" }
  | { kind: "failed" };

/** Enquiry form for a project page. Validates in the browser, then again
    on the server (/api/enquiry). Collects only what a reply needs; asks
    the sender to confirm they are an adult and to keep children's
    details out (Aram 4). Every outcome — including "the inbox isn't
    connected yet" — is said plainly in an aria-live region (Aram 5). */
export function EnquiryForm({ project, asks }: { project: string; asks: BiText[] }) {
  const { lang } = useLang();
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Partial<Record<Field, true>>>({});
  const id = (f: string) => `${uid}-${f}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const body: EnquiryRequest = {
      project,
      name: get("name"),
      contact: get("contact"),
      organisation: get("organisation") || undefined,
      interest: Number(get("interest")),
      message: get("message"),
      adult: fd.get("adult") === "on",
      consent: fd.get("consent") === "on",
      lang,
      website: get("website") || undefined,
    };

    const next: Partial<Record<Field, true>> = {};
    if (!body.name || body.name.length > ENQUIRY_LIMITS.name) next.name = true;
    if (!validContact(body.contact)) next.contact = true;
    if (!Number.isInteger(body.interest) || body.interest < 0 || body.interest >= asks.length) next.interest = true;
    if (body.message.length < ENQUIRY_LIMITS.minMessage || body.message.length > ENQUIRY_LIMITS.message) next.message = true;
    if (!body.adult) next.adult = true;
    if (!body.consent) next.consent = true;
    setErrors(next);
    const first = (Object.keys(next) as Field[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json()) as EnquiryResponse;
      if (data.ok) {
        setStatus({ kind: "sent", reference: data.reference });
        form.reset();
        return;
      }
      const f = data.error.field;
      if (data.error.code === "bad_request" && f && f in FIELD_ERROR) {
        setErrors({ [f]: true });
        setStatus({ kind: "idle" });
        form.querySelector<HTMLElement>(`[name="${f}"]`)?.focus();
        return;
      }
      setStatus({ kind: data.error.code === "unconfigured" ? "unconfigured" : data.error.code === "rate_limited" ? "limited" : "failed" });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  const err = (f: Field) =>
    errors[f] ? (
      <Bi as="p" ta={FIELD_ERROR[f].ta} en={FIELD_ERROR[f].en} className="mt-1.5 flex flex-col text-sm text-[color:var(--palai)]" />
    ) : null;
  const errId = (f: Field) => (errors[f] ? id(`${f}-err`) : undefined);
  const field = "ybi-field w-full rounded-2xl px-4 py-3 text-base";
  const label = "mb-1.5 flex flex-wrap gap-x-1.5 text-sm text-ivory";

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-[color:var(--mullai)]/40 bg-night-2/70 p-6">
        <Bi as="p" ta={T.sent.ta} en={T.sent.en} className="flex flex-col gap-1 font-display text-lg text-ivory" enClass="text-base text-ivory-dim" />
        <p className="mt-2 text-sm text-ivory-dim">
          <Bi ta={T.reference.ta} en={T.reference.en} className="inline-flex gap-1" separator="/" />: <span className="font-mono text-ivory">{status.reference}</span>
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={id("name")} className={label}>
          <Bi ta={T.name.ta} en={T.name.en} className="inline-flex gap-1.5" separator="·" />
        </label>
        <input id={id("name")} name="name" required maxLength={ENQUIRY_LIMITS.name} autoComplete="name" aria-invalid={errors.name || undefined} aria-describedby={errId("name")} className={field} />
        <div id={id("name-err")}>{err("name")}</div>
      </div>

      <div>
        <label htmlFor={id("contact")} className={label}>
          <Bi ta={T.contact.ta} en={T.contact.en} className="inline-flex gap-1.5" separator="·" />
        </label>
        <input
          id={id("contact")} name="contact" required maxLength={ENQUIRY_LIMITS.contact} autoComplete="email" inputMode="email"
          aria-invalid={errors.contact || undefined} aria-describedby={[id("contact-hint"), errId("contact")].filter(Boolean).join(" ")} className={field}
        />
        <div id={id("contact-hint")}>
          <Bi as="p" ta={T.contactHint.ta} en={T.contactHint.en} className="mt-1.5 flex flex-col text-xs text-ivory-dim" />
        </div>
        <div id={id("contact-err")}>{err("contact")}</div>
      </div>

      <div>
        <label htmlFor={id("organisation")} className={label}>
          <Bi ta={T.organisation.ta} en={T.organisation.en} className="inline-flex gap-1.5" separator="·" />
        </label>
        <input id={id("organisation")} name="organisation" maxLength={ENQUIRY_LIMITS.organisation} autoComplete="organization" className={field} />
      </div>

      <div>
        <label htmlFor={id("interest")} className={label}>
          <Bi ta={T.interest.ta} en={T.interest.en} className="inline-flex gap-1.5" separator="·" />
        </label>
        <select id={id("interest")} name="interest" required defaultValue="0" aria-invalid={errors.interest || undefined} aria-describedby={errId("interest")} className={field}>
          {asks.map((a, i) => (
            <option key={a.en} value={i}>
              {lang === "ta" ? a.ta : lang === "en" ? a.en : `${a.ta} · ${a.en}`}
            </option>
          ))}
        </select>
        <div id={id("interest-err")}>{err("interest")}</div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={id("message")} className={label}>
          <Bi ta={T.message.ta} en={T.message.en} className="inline-flex gap-1.5" separator="·" />
        </label>
        <textarea
          id={id("message")} name="message" required rows={5} minLength={ENQUIRY_LIMITS.minMessage} maxLength={ENQUIRY_LIMITS.message}
          aria-invalid={errors.message || undefined} aria-describedby={[id("message-hint"), errId("message")].filter(Boolean).join(" ")} className={`${field} resize-y`}
        />
        <div id={id("message-hint")}>
          <Bi as="p" ta={T.messageHint.ta} en={T.messageHint.en} className="mt-1.5 flex flex-col text-xs text-ivory-dim" />
        </div>
        <div id={id("message-err")}>{err("message")}</div>
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2">
        <div>
          <label className="flex items-start gap-3 text-sm text-ivory">
            <input type="checkbox" name="adult" required aria-invalid={errors.adult || undefined} aria-describedby={errId("adult")} className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--gold)]" />
            <Bi ta={T.adult.ta} en={T.adult.en} className="flex flex-col gap-0.5" enClass="text-ivory-dim" />
          </label>
          <div id={id("adult-err")}>{err("adult")}</div>
        </div>
        <div>
          <label className="flex items-start gap-3 text-sm text-ivory">
            <input type="checkbox" name="consent" required aria-invalid={errors.consent || undefined} aria-describedby={errId("consent")} className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--gold)]" />
            <Bi ta={T.consent.ta} en={T.consent.en} className="flex flex-col gap-0.5" enClass="text-ivory-dim" />
          </label>
          <div id={id("consent-err")}>{err("consent")}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <div>
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night transition-all hover:bg-ivory hover:text-night disabled:opacity-60"
          >
            {status.kind === "sending" ? (
              <Bi ta={T.sending.ta} en={T.sending.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            ) : (
              <Bi ta={T.send.ta} en={T.send.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            )}
          </button>
        </div>
        <div id={id("status")} role="status" aria-live="polite">
          {status.kind === "unconfigured" && (
            <div className="rounded-2xl border border-[color:var(--marutham)]/50 p-4 text-sm">
              <Bi as="p" ta={T.unconfigured.ta} en={T.unconfigured.en} className="flex flex-col gap-1 text-ivory" enClass="text-ivory-dim" />
              <a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-gold underline underline-offset-4">
                <Bi ta={T.discord.ta} en={T.discord.en} className="inline-flex gap-1.5" separator="·" />
              </a>
            </div>
          )}
          {status.kind === "limited" && <Bi as="p" ta={T.limited.ta} en={T.limited.en} className="flex flex-col gap-1 text-sm text-ivory" />}
          {status.kind === "failed" && <Bi as="p" ta={T.failed.ta} en={T.failed.en} className="flex flex-col gap-1 text-sm text-ivory" />}
        </div>
      </div>
    </form>
  );
}
