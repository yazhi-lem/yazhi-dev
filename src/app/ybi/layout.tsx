import type { ReactNode } from "react";
import { BubbleShell, type ShellNavItem } from "@/bubble";

const NAV: ShellNavItem[] = [
  { href: "/ybi", label: "Overview", tone: "gold" },
  { href: "/ybi#palette", label: "Palette", tone: "palai" },
  { href: "/ybi#primitives", label: "Primitives", tone: "mullai" },
  { href: "/ybi#controls", label: "Controls", tone: "neytal" },
  { href: "/ybi#patterns", label: "Patterns", tone: "kurinji" },
  { href: "/ybi#blocks", label: "Blocks", tone: "marutham" },
];

export default function YbiLayout({ children }: { children: ReactNode }) {
  return (
    <BubbleShell product="Library" productHref="/ybi" nav={NAV} theme="mugil" themeSwitch>
      {children}
    </BubbleShell>
  );
}
