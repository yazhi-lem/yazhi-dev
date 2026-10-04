import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ProjectIndex } from "@/components/projects/ProjectIndex";

export const metadata: Metadata = {
  title: "திட்டங்கள் • Projects — Yazhi",
  description: "Every Yazhi project on the 2026 launch line: what it is, when it lands, and how to enquire.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <ProjectIndex />
      <Footer />
    </>
  );
}
