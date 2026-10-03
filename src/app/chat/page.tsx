import type { Metadata } from "next";
import { ChatApp } from "@/components/chat/ChatApp";

export const metadata: Metadata = {
  title: "யாழி உரையாடல் • Yazhi Chat",
  description: "Ask Yazhi's own agents — Avai for inscriptions and artefacts, Sevai for government schemes — served sovereign through yazhi-api.",
};

export default function ChatPage() {
  return <ChatApp />;
}
