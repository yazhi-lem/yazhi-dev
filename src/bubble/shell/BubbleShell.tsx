import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/LogoMark";
import { LangToggle } from "@/components/ui/LangToggle";
import { ShellNav, type ShellNavItem } from "./ShellNav";

/** App frame for every Yazhi Dev product surface (/foundry today; keys,
    playground, skills registry next). A slim top bar — mark, product
    name, section nav, language toggle — over a centred content column.
    Marketing chrome (Navbar, ThinaiRail, 3D world) stays off these
    routes so tools load fast. */
export function BubbleShell({
  product,
  productHref,
  nav,
  children,
}: {
  product: string;
  productHref: string;
  nav: ShellNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <a
        href="#ybi-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-night/80 backdrop-blur">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Yazhi home">
            <LogoMark size={28} />
            <span className="font-display text-lg text-ivory">Yazhi Dev</span>
          </Link>
          <Link href={productHref} className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {product}
          </Link>
          <div className="order-last w-full min-w-0 sm:order-none sm:w-auto sm:flex-1">
            <ShellNav items={nav} />
          </div>
          <div className="ml-auto sm:ml-0">
            <LangToggle />
          </div>
        </div>
      </header>
      <main id="ybi-main" className="mx-auto max-w-[var(--max-w)] px-4 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
