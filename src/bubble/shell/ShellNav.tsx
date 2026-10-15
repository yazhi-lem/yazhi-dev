"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toneStyle, type Tone } from "../tone";

export interface ShellNavItem {
  href: string;
  label: string;
  tone?: Tone;
}

/** Horizontal pill nav. The only client piece of the shell — it needs
    the pathname to mark the current section. Scrolls sideways on phones. */
export function ShellNav({ items }: { items: ShellNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className="-mx-1 overflow-x-auto px-1">
      <ul className="flex gap-1 whitespace-nowrap">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                style={toneStyle(it.tone ?? "gold")}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors ${
                  active ? "bg-[color:var(--tone)]/15 text-ivory" : "text-ivory-dim hover:text-ivory"
                }`}
              >
                <span className="ybi-dot" aria-hidden />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
