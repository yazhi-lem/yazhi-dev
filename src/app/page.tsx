import { Navbar } from "@/components/nav/Navbar";
import { Hero } from "@/components/hero/Hero";
import { Vision } from "@/components/sections/Vision";
import { Paths } from "@/components/sections/Paths";
import { Community } from "@/components/sections/Community";
import { Footer } from "@/components/footer/Footer";
import { World } from "@/components/providers/World";

/* Tamil first, nothing extra: who we are, where we're going (Yazhi
   2030), the three paths our services take, and an invitation. Project
   detail lives on each project's own page. */
export default function Home() {
  return (
    <>
      <World />
      <Navbar />
      <main>
        <Hero />
        <Vision />
        <Paths />
        <Community />
      </main>
      <Footer />
    </>
  );
}
