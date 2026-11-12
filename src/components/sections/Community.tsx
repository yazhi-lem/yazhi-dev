"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import Link from "next/link";
import { COMMUNITY, DEVELOPERS, SERVICES } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { useSiteT } from "@/lib/i18n";

/** Neytal (coastal · separation) governs Community: the diaspora across
    the seas, and the network that closes the separation. */
export function Community() {
  const t = useSiteT();
  return (
    <Section id="community">
      <SectionHeading
        thinaiKey="site.section.community.thinai"
        landscapeKey="site.section.community.landscape"
        titleKey="site.community.title"
        subKey="site.community.sub"
        plainKey="site.community.plain"
      />

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 sm:grid-cols-3"
      >
        {COMMUNITY.cards.map((c, i) => (
          <Card key={c.en}>
            <Bi
              as="h3"
              ta={t(`site.community.card.${i}.title`)}
              en={t(`site.community.card.${i}.title`, undefined, { language: "en" })}
              className="flex flex-col font-display text-lg font-semibold"
            />
            <Bi
              as="p"
              ta={t(`site.community.card.${i}.body`)}
              en={t(`site.community.card.${i}.body`, undefined, { language: "en" })}
              className="mt-1 flex flex-col gap-1 text-sm text-ivory-dim"
            />
            <div className="mt-5">
              <Button href={c.href} variant="ghost" external={c.external}>{c.label}</Button>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* honest note for families: the chat platforms have their own age rules */}
      <Bi
        as="p"
        ta={t("site.community.chatAge")}
        en={t("site.community.chatAge", undefined, { language: "en" })}
        className="mt-4 flex flex-col gap-0.5 text-xs text-ivory-dim/80"
      />

      {/* Developer track — a community for developers across India building
          for their own mother tongues, distinct from the family-facing
          "Join the Network" card above. Routes to the same onboarding form
          with a developer track flag, then to Discord — see
          docs/community/PRD-DEVELOPER-COMMUNITY.md for the account-provisioning plan. */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mt-12"
      >
        <Card interactive={false} className="!p-0 overflow-hidden">
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr_auto] sm:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/yazh/yazh-waving.png"
              alt=""
              aria-hidden
              className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
            <div>
              <Bi as="p" ta={t("site.developers.eyebrow")} en={t("site.developers.eyebrow", undefined, { language: "en" })} className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
              <Bi as="h3" ta={t("site.developers.title")} en={t("site.developers.title", undefined, { language: "en" })} className="mt-1 flex flex-col font-display text-xl font-semibold sm:flex-row sm:gap-2" separator={<span aria-hidden className="hidden sm:inline">·</span>} />
              <p className="mt-2 max-w-prose text-sm text-ivory-dim">{t("site.developers.body")}</p>
              <Link href="/repos" className="mt-3 inline-flex gap-1.5 text-sm text-[color:var(--accent)] hover:underline">
                {t("site.repos.link")} →
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Button href={DEVELOPERS.ctaHref}>
                <Bi
                  ta={t("site.developers.cta")}
                  en={t("site.developers.cta", undefined, { language: "en" })}
                  className="flex gap-1.5"
                  separator={<span aria-hidden>·</span>}
                />
              </Button>
              <Button href="https://discord.gg/yazhi" variant="ghost" external>
                <Bi
                  ta={t("site.developers.discordCta")}
                  en={t("site.developers.discordCta", undefined, { language: "en" })}
                  className="flex gap-1.5"
                  separator={<span aria-hidden>·</span>}
                />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Services — nav items exist, sections don't yet: honest coming-soon strip */}
      <motion.aside
        id="services"
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--radius-card)] border border-dashed border-ivory/20 px-6 py-5"
        aria-label={t("site.services.asideLabel")}
      >
        <Bi as="p" ta={t("site.services.label")} en={t("site.services.label", undefined, { language: "en" })} className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
        {SERVICES.map((s, i) => (
          <Bi
            key={s.en}
            ta={t(`site.services.${i}`, undefined, { listingTerms: true })}
            en={t(`site.services.${i}`, undefined, { language: "en" })}
            className="flex gap-1.5 text-sm text-ivory-dim"
            separator={<span aria-hidden className="text-ivory/30">·</span>}
          />
        ))}
        <span className="ml-auto rounded-full border border-ivory/15 px-3 py-1 text-xs text-ivory-dim">
          <Bi ta={t("site.services.comingSoon")} en={t("site.services.comingSoon", undefined, { language: "en" })} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </span>
      </motion.aside>
    </Section>
  );
}
