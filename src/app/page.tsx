import Hero from "@/components/Hero";
import AdhanShowcase from "@/components/AdhanShowcase";
import SangamShowcase from "@/components/SangamShowcase";
import YazhAppShowcase from "@/components/YazhAppShowcase";
import ServicesGrid from "@/components/ServicesGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <AdhanShowcase />
      <SangamShowcase />
      <YazhAppShowcase />
      <ServicesGrid />
      <Footer />
    </main>
  );
}
