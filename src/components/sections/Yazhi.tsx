"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { InteractiveDevice } from "@/components/ui/InteractiveDevice";
import { useSiteT } from "@/lib/i18n";

const LANGUAGES = [
  { code: "ta", label: "தமிழ்", en: "Tamil" },
  { code: "en", label: "ஆங்கிலம்", en: "English" },
  { code: "te", label: "தெலுங்கு", en: "Telugu" },
  { code: "kn", label: "கன்னடம்", en: "Kannada" },
  { code: "ml", label: "மலையாளம்", en: "Malayalam" },
  { code: "all", label: "+17 இந்திய மொழிகள்", en: "+17 more" },
];

export function Yazhi() {
  const t = useSiteT();

  return (
    <Section id="yazhi">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Content & Storytelling - Clean Floating Typography) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col justify-center lg:col-span-7 min-w-0"
        >
          <SectionHeading
            thinaiKey="site.section.yazhi.thinai"
            landscapeKey="site.section.yazhi.landscape"
            titleKey="site.identity.name"
            subKey="site.yazhi.sub"
            plainKey="site.yazhi.plain"
          />

          <motion.div variants={fadeUp}>
            <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-ivory-dim">
              {t("site.yazhi.body")}
            </p>
          </motion.div>

          {/* Supported Languages Badges */}
          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-widest text-ivory-dim/60 mr-1 font-mono">
              {"Languages:"}
            </span>
            {LANGUAGES.map((l) => (
              <span
                key={l.code}
                className="rounded-full border border-white/12 bg-[#090a0f]/90 px-2.5 py-0.5 font-mono text-[10px] text-ivory-dim transition-colors hover:border-gold/50 hover:text-ivory"
              >
                <Bi ta={l.label} en={l.en} separator={<span className="opacity-50"> · </span>} />
              </span>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/chat">
              <Bi
                ta="அரட்டையைத் தொடங்குக"
                en="Try Yazhi Chat →"
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
            <Button href="#adhan" variant="ghost">
              <Bi
                ta="பொறியை அறிக"
                en="Explore the Engine"
                className="flex gap-1.5"
                separator={<span aria-hidden>·</span>}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column (Interactive Mobile Device Mockup) */}
        <div className="flex items-center justify-center lg:col-span-5">
          <InteractiveDevice />
        </div>
      </div>
    </Section>
  );
}
