import Hero from "@/components/Hero";
import AdhanShowcase from "@/components/AdhanShowcase";
import SangamShowcase from "@/components/SangamShowcase";
import YazhAppShowcase from "@/components/YazhAppShowcase";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";
import ThinaiBar from "@/components/ThinaiBar";
import ScrollThemeObserver from "@/components/ScrollThemeObserver";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <ScrollThemeObserver />
      <ThinaiBar />

      <section data-thinai="hero">
        <Hero />
      </section>

      <section data-thinai="adhan">
        <AdhanShowcase />
      </section>

      <section data-thinai="sangam">
        <SangamShowcase />
      </section>

      <section data-thinai="yazh">
        <YazhAppShowcase />
      </section>

      <section data-thinai="services">
        <ServicesGrid />
      </section>

      <section data-thinai="footer">
        <Footer />
      </section>
    </main>
  );
}
