"use client";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Bi } from "@/components/ui/Bi";
import { IDENTITY, YAZHI_SECTION } from "@/lib/content";
import { stagger, fadeUp } from "@/lib/motionPresets";
import { InteractiveDevice } from "@/components/ui/InteractiveDevice";

const LANGUAGES = [
  { code: "ta", label: "தமிழ்", en: "Tamil" },
  { code: "te", label: "தெலுங்கு", en: "Telugu" },
  { code: "hi", label: "இந்தி", en: "Hindi" },
  { code: "kn", label: "கன்னடம்", en: "Kannada" },
  { code: "ml", label: "மலையாளம்", en: "Malayalam" },
  { code: "all", label: "+17 இந்திய மொழிகள்", en: "+17 more" },
];

export function Yazhi() {
  return (
    <Section id="yazhi" fullHeight className="py-6 sm:py-8 lg:py-10">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Column (Content & Storytelling) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="text-scrim flex flex-col justify-center lg:col-span-7"
        >
          <SectionHeading
            thinaiTa="குறிஞ்சி"
            thinaiEn="Kurinji"
            landscapeTa="மலை · புணர்தல்"
            landscape="Mountains · first meetings"
            titleTa={IDENTITY.nameTa}
            titleEn={IDENTITY.nameEn}
            subTa={YAZHI_SECTION.subTa}
            subEn={YAZHI_SECTION.subEn}
            plainTa={YAZHI_SECTION.plainTa}
            plainEn={YAZHI_SECTION.plainEn}
            className="mb-3.5"
          />

          <motion.div variants={fadeUp}>
            <Bi
              as="p"
              ta={YAZHI_SECTION.bodyTa}
              en={YAZHI_SECTION.bodyEn}
              className="max-w-3xl text-xs sm:text-sm leading-relaxed text-ivory-dim flex flex-col gap-1.5"
            />
          </motion.div>

          {/* Supported Languages Badges */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-1.5">
            <Bi
              as="span"
              ta="மொழிகள்:"
              en="Languages:"
              className="text-[11px] uppercase tracking-widest text-ivory-dim/60 mr-1"
            />
            {LANGUAGES.map((l) => (
              <span
                key={l.code}
                className="rounded-full border border-white/10 bg-night-2/80 px-2.5 py-0.5 font-mono text-[10px] text-ivory-dim transition-colors hover:border-gold/40 hover:text-ivory"
              >
                <Bi ta={l.label} en={l.en} separator={<span className="opacity-50"> · </span>} />
              </span>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-3">
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

