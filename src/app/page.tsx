import { Navbar } from "@/components/nav/Navbar";
import { Hero } from "@/components/hero/Hero";
import { Verse } from "@/components/sections/Verse";
import { Problem } from "@/components/sections/Problem";
import { Movement } from "@/components/sections/Movement";
import { Build } from "@/components/sections/Build";
import { Roadmap } from "@/components/sections/Roadmap";
import { Join } from "@/components/sections/Join";
import { Footer } from "@/components/footer/Footer";
import { World } from "@/components/providers/World";

/* One story, one ask: the opening of Maduraikanchi as an experience,
   the problem (our languages are at the back of the
   line in AI), Yazhi as a people's movement, what it is building (kept
   quiet), the 2026 roadmap, and an invitation to build with us. Each project's full
   detail and enquiry form live on /projects/[slug]. */
export default function Home() {
  return (
    <>
      <World />
      <Navbar />
      <main>
        <Hero />
        <Verse />
        <Problem />
        <Movement />
        <Build />
        <Roadmap />
        <Join />
      </main>
      <Footer />
    </>
  );
}
