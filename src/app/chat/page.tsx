import type { Metadata } from "next";
import { YazhiChat } from "@/components/chat/YazhiChat";

export const metadata: Metadata = {
  title: "யாழி Chat — Yazhi's agents, in their landscapes",
  description:
    "Talk to Yazhi's agents in the Bubble UI: each one lives in a Sangam landscape, replies stream from yazhi-api or a model on your own device.",
};

export default function ChatPage() {
  return <YazhiChat />;
}
