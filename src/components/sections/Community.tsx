"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { COMMUNITY, DEVELOPERS, SERVICES, UI } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Neytal (coastal · separation) governs Community: the diaspora across
    the seas, and the network that closes the separation. */
export function Community() {
  return (
    <Section id="community">
      <SectionHeading
        thinaiTa="நெய்தல்" thinaiEn="Neytal" landscapeTa="கடற்கரை" landscape="Coastal · separation, pining"
        titleTa={COMMUNITY.titleTa} titleEn={COMMUNITY.titleEn}
        subTa={COMMUNITY.subTa} subEn={COMMUNITY.subEn}
        plainTa={COMMUNITY.plainTa} plainEn={COMMUNITY.plainEn}
      />

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 sm:grid-cols-3"
      >
        {COMMUNITY.cards.map((c) => (
          <Card key={c.en}>
            <Bi as="h3" ta={c.ta} en={c.en} className="flex flex-col font-display text-lg font-semibold" />
            <Bi as="p" ta={c.bodyTa} en={c.bodyEn} className="mt-1 flex flex-col gap-1 text-sm text-ivory-dim" />
            <div className="mt-5">
              <Button href={c.href} variant="ghost" external={c.external}>{c.label}</Button>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* honest note for families: the chat platforms have their own age rules */}
      <Bi
        as="p"
        ta={COMMUNITY.chatAgeTa}
        en={COMMUNITY.chatAgeEn}
        className="mt-4 flex flex-col gap-0.5 text-xs text-ivory-dim/80"
      />

      {/* Developer track — a community for developers across India building
          for their own mother tongues, distinct from the family-facing
          "Join the Network" card above. Routes to the same onboarding form
          with a developer track flag, then to Discord — see
          docs/PRD-DEVELOPER-COMMUNITY.md for the account-provisioning plan. */}
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
              <Bi as="p" ta={DEVELOPERS.eyebrowTa} en={DEVELOPERS.eyebrowEn} className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
              <Bi as="h3" ta={DEVELOPERS.titleTa} en={DEVELOPERS.titleEn} className="mt-1 flex flex-col font-display text-xl font-semibold sm:flex-row sm:gap-2" separator={<span aria-hidden className="hidden sm:inline">·</span>} />
              <p lang="en" className="mt-2 max-w-prose text-sm text-ivory-dim">{DEVELOPERS.bodyEn}</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Button href={DEVELOPERS.ctaHref}>
                <Bi ta={DEVELOPERS.ctaTa} en={DEVELOPERS.ctaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
              </Button>
              <Button href="https://discord.gg/yazhi" variant="ghost" external>
                <Bi ta={DEVELOPERS.discordCtaTa} en={DEVELOPERS.discordCtaEn} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
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
        aria-label="Services — coming soon"
      >
        <Bi as="p" ta={UI.servicesLabel.ta} en={UI.servicesLabel.en} className="flex gap-2 text-xs uppercase tracking-widest text-[color:var(--accent)]" separator={<span aria-hidden>·</span>} />
        {SERVICES.map((s) => (
          <Bi key={s.en} ta={s.ta} en={s.en} className="flex gap-1.5 text-sm text-ivory-dim" separator={<span aria-hidden className="text-ivory/30">·</span>} />
        ))}
        <span className="ml-auto rounded-full border border-ivory/15 px-3 py-1 text-xs text-ivory-dim">
          <Bi ta={UI.comingSoon.ta} en={UI.comingSoon.en} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
        </span>
      </motion.aside>
    </Section>
  );
}
