import IntroTransmission from "@/components/IntroTransmission";
import Hero from "@/components/Hero";
import AdhanShowcase from "@/components/AdhanShowcase";
import SangamShowcase from "@/components/SangamShowcase";
import YazhAppShowcase from "@/components/YazhAppShowcase";
import Footer from "@/components/Footer";
import ThinaiBar from "@/components/ThinaiBar";

export default function Home() {
  return (
    <main className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <ThinaiBar />

      {/* Smooth gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 transition-all duration-[2000ms] ease-in-out"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--accent-light) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, var(--surface) 50%, transparent 100%)
          `,
          mixBlendMode: 'soft-light'
        }}
      />

      <IntroTransmission />
      <Hero />
      <AdhanShowcase />
      <YazhAppShowcase />
      <SangamShowcase />
      <Footer />
    </main>
  );
}
