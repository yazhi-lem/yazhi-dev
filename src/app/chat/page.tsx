import type { Metadata } from "next";
import { ChatApp } from "@/components/chat/ChatApp";

export const metadata: Metadata = {
  title: "யாழி Chat — Agents · Gemini & ChatGPT",
  description:
    "Chat with Yazhi's agents — fixed to Gemini and ChatGPT, wired through the yazhi-api backend.",
};

export default function ChatPage() {
  return <ChatApp />;
}
