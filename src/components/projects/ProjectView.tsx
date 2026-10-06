"use client";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Bi } from "@/components/ui/Bi";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/projects/EnquiryForm";
import { useLang } from "@/lib/i18n";
import { PROJECTS_BY_DATE, asksFor, formatDate, getProject, type BiText } from "@/lib/projects";
import { toneStyle } from "@/bubble/tone";

const T = {
  all: { ta: "எல்லாத் திட்டங்களும்", en: "All projects" },
  enquire: { ta: "விசாரிக்க", en: "Enquire" },
  github: { ta: "GitHub-இல் காண்க", en: "See it on GitHub" },
  why: { ta: "ஏன்", en: "Why" },
  does: { ta: "என்ன செய்கிறது", en: "What it does" },
  forWhom: { ta: "யாருக்காக", en: "Who it's for" },
  timeline: { ta: "வழித்தடம்", en: "Timeline" },
  gate: { ta: "வெளியீட்டு நிபந்தனை", en: "Launch gate" },
  enquiryTitle: { ta: "எங்களுக்கு எழுதுக", en: "Write to us" },
  enquiryLead: {
    ta: "பயன்படுத்த, சோதனை ஓட்டம் நடத்த, பங்களிக்க, கூட்டுச் சேர — எதுவானாலும் கேளுங்கள்.",
    en: "To use it, pilot it, contribute or partner — ask us anything.",
  },
  others: { ta: "மற்ற திட்டங்கள்", en: "Other projects" },
  draft: {
    ta: "இந்தப் பக்கத்தின் தமிழ் ஒரு வரைவு; தாய்மொழியாளர் மதிப்பாய்வு நடைபெறுகிறது. இன்னும் திட்டத்தில் உள்ளவை திட்டமாகவே சொல்லப்பட்டுள்ளன.",
    en: "The Tamil on this page is a draft pending native review. Anything still planned is written as planned.",
  },
  tryTitle: { ta: "முயன்று பார்க்க", en: "Try it" },
  tryNote: {
    ta: "டோக்கனைசர் அக்டோபர் 31 அளவீட்டுடன் வெளியாகும். அதன் பின், adhan interact உங்கள் தமிழ் வாக்கியம் எத்தனை டோக்கன்களாகிறது என்று காட்டும்.",
    en: "The tokenizer is published with the 31 October benchmark. After that, adhan interact shows how many tokens your Tamil sentence becomes.",
  },
  previewTitle: { ta: "வடிவமைப்பு முன்னோட்டம்", en: "Design preview" },
  previewNote: {
    ta: "யாழின் முகபாவங்கள் — இவை வடிவமைப்புப் படங்கள்; இயங்கும் செயலி அல்ல. குழந்தைகளுக்கான திறந்த டெமோ, ஒப்புதல்கள் கிடைக்கும் வரை இல்லை.",
    en: "Yazh's expressions — design art, not the running app. There is no open demo for children until the sign-offs are in.",
  },
} satisfies Record<string, BiText>;

const YAZH_FACES = [
  { src: "/yazh/yazh-waving.png", ta: "வணக்கம்", en: "Hello" },
  { src: "/yazh/yazh-thinking.png", ta: "யோசிக்கிறது", en: "Thinking" },
  { src: "/yazh/yazh-surprised.png", ta: "வியப்பு", en: "Surprised" },
  { src: "/yazh/yazh-sleepy.png", ta: "தூக்கம்", en: "Sleepy" },
];

/** A heading that leads in Tamil with an English gloss — or stands in
    English alone in ENG mode. */
function Heading({ as: Tag = "h2", t, id, big = false }: { as?: "h1" | "h2"; t: BiText; id?: string; big?: boolean }) {
  const { lang } = useLang();
  const size = big
    ? "text-[length:min(var(--text-5xl),calc((100vw_-_3rem)/7))]"
    : "text-[length:min(var(--text-2xl),calc((100vw_-_3rem)/9))]";
  return (
    <Tag id={id}>
      <Bi
        ta={t.ta} en={t.en} display
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
        taClass={`font-display ${size} font-semibold text-ivory`}
        enClass={lang === "en" ? `font-display ${size} font-semibold text-ivory` : "font-display text-[length:var(--text-lg)] text-ivory-dim"}
      />
    </Tag>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[var(--radius-card)] border border-ivory/10 bg-night-2/70 p-6 backdrop-blur ${className}`}>{children}</section>;
}

/** Everything about one project: what, why, what it does, for whom, the
    timeline and its launch gate, a demo where one exists, and an
    enquiry form. Content comes from src/lib/projects.ts. */
export function ProjectView({ slug }: { slug: string }) {
  const p = getProject(slug);
  if (!p) return null;
  const others = PROJECTS_BY_DATE.filter((o) => o.slug !== p.slug);

  return (
    <main id="main" style={toneStyle(p.tone)} className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]"
        style={{ background: "radial-gradient(60% 70% at 20% 0%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 70%)" }}
      />
      <div className="mx-auto max-w-[var(--max-w)] px-6 pb-[var(--space-section)] pt-28 sm:px-8 lg:px-10">
        <Link href="/projects" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
          <span aria-hidden>← </span>
          <Bi ta={T.all.ta} en={T.all.en} className="inline-flex gap-1.5" separator="·" />
        </Link>

        {/* header */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-5">
            <Bi as="p" ta={p.kind.ta} en={p.kind.en} className="ybi-tone-text flex flex-wrap gap-1.5 text-sm" separator={<span aria-hidden>·</span>} />
            <Heading as="h1" t={p.name} big />
            <Bi as="p" ta={p.what.ta} en={p.what.en} className="flex max-w-2xl flex-col gap-1 text-[length:var(--text-lg)] text-ivory" enClass="text-base text-ivory-dim" />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {p.demo && (
                <Button href={p.demo.href} external={p.demo.external}>
                  <Bi ta={p.demo.ta} en={p.demo.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
                </Button>
              )}
              <Button href="#enquiry" variant={p.demo ? "ghost" : "primary"}>
                <Bi ta={T.enquire.ta} en={T.enquire.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
              </Button>
              {p.repo && p.repo !== p.demo?.href && (
                <Button href={p.repo} variant="ghost" external>
                  <Bi ta={T.github.ta} en={T.github.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
                </Button>
              )}
            </div>
            {p.demo?.note && <Bi as="p" ta={p.demo.note.ta} en={p.demo.note.en} className="flex flex-col text-sm text-ivory-dim" />}
          </div>

          <Panel className="border-[color:var(--tone)]/30">
            <Heading t={T.timeline} />
            <ol className="mt-4 flex flex-col gap-3">
              {p.milestones.map((m) => {
                const d = formatDate(m.date);
                return (
                  <li key={m.date} className="flex flex-col gap-0.5 border-l-2 border-[color:var(--tone)]/60 pl-3">
                    <Bi ta={d.ta} en={d.en} className="ybi-tone-text inline-flex gap-1.5 text-sm" separator="·" />
                    <Bi ta={m.label.ta} en={m.label.en} className="flex flex-col text-ivory" enClass="text-sm text-ivory-dim" />
                    <Bi ta={m.tier.ta} en={m.tier.en} className="inline-flex flex-wrap gap-1.5 text-xs text-ivory-dim" separator="·" />
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 rounded-2xl border border-[color:var(--tone)]/30 p-4">
              <Bi as="p" ta={T.gate.ta} en={T.gate.en} className="ybi-tone-text flex gap-1.5 text-xs" separator="·" />
              <Bi as="p" ta={p.gate.ta} en={p.gate.en} className="mt-1 flex flex-col gap-1 text-sm text-ivory" enClass="text-ivory-dim" />
            </div>
          </Panel>
        </div>

        {/* detail */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Panel>
            <Heading t={T.why} />
            <Bi as="p" ta={p.why.ta} en={p.why.en} className="mt-3 flex flex-col gap-2 text-ivory-dim" enClass="text-sm" />
          </Panel>
          <Panel className="lg:col-span-2">
            <Heading t={T.does} />
            <ul className="mt-3 flex flex-col gap-3">
              {p.does.map((x) => (
                <li key={x.en} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--tone)]" />
                  <Bi ta={x.ta} en={x.en} className="flex flex-col gap-0.5 text-ivory" enClass="text-sm text-ivory-dim" />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="lg:col-span-3">
            <Heading t={T.forWhom} />
            <Bi as="p" ta={p.forWhom.ta} en={p.forWhom.en} className="mt-3 flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
          </Panel>
        </div>

        {p.slug === "adhan" && (
          <Panel className="mt-5">
            <Heading t={T.tryTitle} />
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-night p-4 font-mono text-sm leading-relaxed text-ivory" lang="en">
              <code>{`git clone https://github.com/yazhi-lem/adhan.git
cd adhan
pip install -e ".[jax]"      # CPU only — no GPU needed
adhan status                 # data, tokenizer and model readiness
adhan interact               # live tokenization, once the tokenizer is out`}</code>
            </pre>
            <Bi as="p" ta={T.tryNote.ta} en={T.tryNote.en} className="mt-3 flex flex-col gap-1 text-sm text-ivory-dim" />
          </Panel>
        )}

        {p.slug === "yazh" && (
          <Panel className="mt-5">
            <div id="preview" className="scroll-mt-28">
              <Heading t={T.previewTitle} />
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {YAZH_FACES.map((f) => (
                <li key={f.src} className="flex flex-col items-center gap-2 rounded-2xl bg-night/60 p-4">
                  <Image src={f.src} alt="" width={160} height={160} className="h-28 w-28 object-contain" />
                  <Bi ta={f.ta} en={f.en} className="inline-flex gap-1.5 text-sm text-ivory-dim" separator="·" />
                </li>
              ))}
            </ul>
            <Bi as="p" ta={T.previewNote.ta} en={T.previewNote.en} className="mt-4 flex flex-col gap-1 text-sm text-ivory-dim" />
          </Panel>
        )}

        {/* enquiry */}
        <section id="enquiry" aria-labelledby="enquiry-title" className="mt-16 scroll-mt-28 rounded-[var(--radius-card)] border border-[color:var(--tone)]/30 bg-night-2/70 p-6 backdrop-blur sm:p-8">
          <Heading t={T.enquiryTitle} id="enquiry-title" />
          <Bi as="p" ta={T.enquiryLead.ta} en={T.enquiryLead.en} className="mb-8 mt-3 flex flex-col gap-1 text-ivory-dim" enClass="text-sm" />
          <EnquiryForm project={p.slug} asks={asksFor(p)} />
        </section>

        {/* other projects */}
        <nav aria-label={`${T.others.ta} · ${T.others.en}`} className="mt-16">
          <Bi as="p" ta={T.others.ta} en={T.others.en} className="mb-4 flex gap-1.5 text-sm text-ivory-dim" separator="·" />
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug} style={toneStyle(o.tone)}>
                <Link href={`/projects/${o.slug}`} className="inline-flex rounded-full border border-[color:var(--tone)]/40 px-4 py-2 text-sm text-ivory transition-colors hover:border-[color:var(--tone)]">
                  <Bi ta={o.name.ta} en={o.name.en} className="inline-flex gap-1.5" separator={<span aria-hidden className="text-ivory/30">·</span>} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Bi as="p" ta={T.draft.ta} en={T.draft.en} className="mt-12 flex flex-col gap-0.5 text-xs text-ivory-dim/80" />
      </div>
    </main>
  );
}
