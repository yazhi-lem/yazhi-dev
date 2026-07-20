"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { Card } from "@/components/ui/Card";
import { ADHAN } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";

/** Mullai (forest · waiting) governs Adhan: a model is grown patiently,
    like a forest — training as cultivation, not conquest. */
export function Adhan() {
  return (
    <Section id="adhan">
      <SectionHeading eyebrow={ADHAN.eyebrow} title={ADHAN.name} sub={ADHAN.sub} />
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.div variants={fadeUp}>
            <Bi as="p" text={ADHAN.body} className="flex max-w-prose flex-col gap-3 text-ivory-dim" />
          </motion.div>
          <motion.dl variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4">
            {ADHAN.stats.map((s) => (
              <Card key={s.label.en} interactive={false} className="!p-4 text-center">
                <dd className="font-display text-3xl font-semibold text-[color:var(--accent)]">{s.value}</dd>
                <dt className="mt-1">
                  <Bi text={s.label} className="flex flex-col text-xs text-ivory-dim" />
                </dt>
              </Card>
            ))}
          </motion.dl>
          <motion.div variants={fadeUp} className="mt-8">
            <Button href={ADHAN.ctaHref} external>
              <Bi text={ADHAN.cta} className="flex gap-1.5" separator={<span aria-hidden>·</span>} />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <CodeBlock code={ADHAN.code} label="adhan_quickstart.py" />
        </motion.div>
      </div>
    </Section>
  );
}
