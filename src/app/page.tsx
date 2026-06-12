import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CommunityFeed from "@/components/CommunityFeed";
import MemberDirectory from "@/components/MemberDirectory";
import Vision from "@/components/Vision";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <CommunityFeed />
      <MemberDirectory />
      
      {/* Shrinking visual intensity by keeping Vision but skipping Sectors for now */}
      <div className="scale-95 origin-top opacity-90 grayscale-[0.2]">
        <Vision />
      </div>
      
      <Footer />
    </main>
  );
}
