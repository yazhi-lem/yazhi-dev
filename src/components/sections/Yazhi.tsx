"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { InteractiveDevice } from "@/components/ui/InteractiveDevice";
import { useSiteT } from "@/lib/i18n";

export function Yazhi() {
  const t = useSiteT();

  return (
    <Section id="yazhi">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (7 cols): Narrative & Action CTAs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col justify-center lg:col-span-7"
        >
          <SectionHeading
            thinaiKey="site.section.yazhi.thinai"
            landscapeKey="site.section.yazhi.landscape"
            titleKey="site.identity.name"
            subKey="site.yazhi.sub"
            plainKey="site.yazhi.plain"
          />

          <motion.div variants={fadeUp}>
            <p className="text-sm sm:text-base leading-relaxed text-ivory-dim">
              {t("site.yazhi.body")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/chat">
              {t("site.identity.name")} Chat →
            </Button>
            <Button href="#adhan" variant="ghost">
              {t("site.adhan.name")}
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column (5 cols): Interactive Mobile Device Mockup */}
        <div className="flex items-center justify-center lg:col-span-5">
          <InteractiveDevice />
        </div>
      </div>
    </Section>
  );
}
