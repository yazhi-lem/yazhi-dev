import { Navbar } from "@/components/nav/Navbar";
import { ThinaiRail } from "@/components/nav/ThinaiRail";
import { ThinaiIntro } from "@/components/hero/ThinaiIntro";
import { Hero } from "@/components/hero/Hero";
import { HeroSignature } from "@/components/hero/HeroSignature";
import { Adhan } from "@/components/sections/Adhan";
import { Sangam } from "@/components/sections/Sangam";
import { Guardian } from "@/components/sections/Guardian";
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
      <main>
        <Hero />
        <HeroSignature />
        <Adhan />
        <Sangam />
        <Guardian />
        <Community />
      </main>
      <Footer />
    </>
  );
}
