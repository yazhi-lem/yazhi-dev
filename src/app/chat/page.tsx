import type { Metadata } from "next";
import { cookies } from "next/headers";
import { YazhiChat } from "@/components/chat/YazhiChat";
import { LOCALE_COOKIE, readLocaleFromCookies } from "@/lib/locale-cookie";
import { ui } from "@yazhi/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = readLocaleFromCookies((await cookies()).get(LOCALE_COOKIE)?.value);
  return { title: ui("chat.metadataTitle", locale), description: ui("chat.metadataDescription", locale) };
}

export default function ChatPage() {
  return <YazhiChat />;
}
