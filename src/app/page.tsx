import { Navbar } from "@/components/nav/Navbar";
import { ThinaiRail } from "@/components/nav/ThinaiRail";
import { ThinaiIntro } from "@/components/hero/ThinaiIntro";
import { Hero } from "@/components/hero/Hero";
import { Yazhi } from "@/components/sections/Yazhi";
import { Adhan } from "@/components/sections/Adhan";
import { Guardian } from "@/components/sections/Guardian";
import { Sangam } from "@/components/sections/Sangam";
import { Thinai } from "@/components/sections/Thinai";
import { Community } from "@/components/sections/Community";
import { Footer } from "@/components/footer/Footer";
import { World } from "@/components/providers/World";
import { LaunchTimer } from "@/components/ui/LaunchTimer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FloatingGlyphs } from "@/components/ui/FloatingGlyphs";

export default function Home() {
  return (
    <>
      <World />
      <FloatingGlyphs />
      <ThinaiIntro />
      <Navbar />
      <ThinaiRail />
      <LaunchTimer />
      <WhatsAppButton />
      {/* deck order: Yazhi is the umbrella, then the three products it
          carries — Yazh (what families pay for), Adhan (the engine
          underneath), Open Sangam (the memory we protect) — then the
          thinai taxonomy both the corpus and the story library share */}
      <main>
        <Hero />
        <Yazhi />
        <Adhan />
        <Guardian />
        <Sangam />
        <Thinai />
        <Community />
      </main>
      <Footer />
    </>
  );
}
