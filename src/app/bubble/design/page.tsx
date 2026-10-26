import type { Metadata } from "next";
import { DesignBook } from "@/components/bubble/design/DesignBook";

export const metadata: Metadata = {
  title: "Design Book — Bubble UI",
  description:
    "The Bubble UI design book: five tinai environments, each with its own ink, motion, ambient field and Hairline figure, plus the principles, tokens and motion rules behind every Yazhi app.",
};

export default function DesignBookPage() {
  return <DesignBook />;
}
