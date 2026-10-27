"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TinaiMark, TinaiScope } from "@yazhi/bubble";
import { HairlineFigure } from "@yazhi/bubble/hairline/HairlineFigure";
import type { HairlineFigureDef } from "@yazhi/bubble/hairline/types";
import yazh from "@yazhi/bubble/hairline/figures/yazh.js";
import { JoinCircle } from "@/components/circle/JoinCircle";
import { IDENTITY, THINAI, UI } from "@/lib/content";
import { fadeUp, stagger } from "@/lib/motionPresets";
import { useLang } from "@/lib/i18n";

/* Tamil copy added with this layout is a DRAFT, native review pending. */

/** The hero: what Yazhi is, in one headline and one line, with one thing
    to do — join Circle — and a quieter way in, the chat. Beside it the
    yazh, drawn as a Hairline figure that plays itself and answers the
    pointer; under it the five landscapes as flat marks. */
export function Hero() {
  const { lang } = useLang();
  const both = lang === "both";
  const t = (ta: string, en: string) => (lang === "en" ? en : ta);
  const tongue = lang === "en" ? "en" : "ta";

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-28 lg:pl-24">
      {/* a soft pool of night behind the words, so they read over the world */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{ background: "radial-gradient(70% 60% at 30% 50%, rgba(5,7,13,0.72), transparent 70%)" }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[var(--max-w)] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-w-0">
          <motion.p variants={fadeUp} lang={tongue} className="inline-flex items-center gap-2 rounded-full border border-ivory/15 bg-night/50 px-3 py-1 text-xs text-ivory-dim backdrop-blur">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            {t(UI.heroEyebrow.ta, UI.heroEyebrow.en)}
          </motion.p>

          <motion.h1 variants={fadeUp} className="mt-6 font-display font-bold">
            <span lang={tongue} className="display block text-balance text-[clamp(2rem,4.4vw,3.15rem)] leading-[1.3]">
              {t(IDENTITY.taglineTa, IDENTITY.taglineEn)}
            </span>
            {both && (
              <span lang="en" className="mt-3 block text-[length:var(--text-lg)] font-normal uppercase tracking-[0.2em] text-ivory-dim">
                {IDENTITY.taglineEn}
              </span>
            )}
          </motion.h1>

          <motion.p variants={fadeUp} lang={tongue} className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ivory-dim">
            {t(IDENTITY.heroLineTa, IDENTITY.heroLineEn)}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <JoinCircle
              className="min-h-12 px-6 text-base"
              signedIn={
                <Link href="/chat" className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 font-semibold text-night transition-colors hover:bg-ivory">
                  <span lang={tongue}>{t("யாழியுடன் பேசுக", "Talk to Yazhi")}</span>
                </Link>
              }
            />
            <Link
              href="/chat"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ivory/20 bg-night/40 px-5 text-ivory backdrop-blur transition-colors hover:border-ivory/50"
            >
              <span lang={tongue}>{t("உரையாடலைத் திற", "Open the chat")}</span>
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2" aria-label={t("ஐந்திணை", "Five landscapes")}>
            {THINAI.map((l) => (
              <li key={l.key} className="flex items-center gap-1.5 text-xs text-ivory-dim">
                <span style={{ color: `var(--${l.key})` }}>
                  <TinaiMark tinai={l.key} size={14} />
                </span>
                <span lang={tongue}>{t(l.ta, l.en)}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto w-full max-w-[30rem] lg:max-w-none">
          <TinaiScope tinai="kurinji" scheme="dark" ground={false} className="rounded-[2rem] border border-ivory/10 bg-night/45 p-5 backdrop-blur-md">
            <HairlineFigure figure={yazh as HairlineFigureDef} play caption={false} className="w-full" />
            <p lang={tongue} className="mt-1 text-center text-xs text-ivory-dim">
              {t("யாழை மீட்டுங்கள் — ஒவ்வொரு நரம்பும் அடுத்ததை எழுப்பும்", "Pluck the yazh — each string wakes the next")}
            </p>
          </TinaiScope>
        </motion.div>
      </div>

      <a
        href="#yazhi"
        aria-label={lang === "en" ? UI.scrollCue.en : UI.scrollCue.ta}
        className="absolute bottom-6 left-1/2 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full text-ivory-dim transition-colors hover:text-ivory max-lg:hidden"
      >
        <span aria-hidden className="scroll-cue-arrow">↓</span>
      </a>
    </section>
  );
}
