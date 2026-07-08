/** Minimal monoline icons for the five landscapes — replaces emoji in the
    rail for a more professional register (emoji stay in the Sangam
    classifier table, where they are the brand file's literal content). */
import type { ThinaiKey } from "@/lib/content";

const PATHS: Record<ThinaiKey, React.ReactNode> = {
  kurinji: <path d="M3 19 9 8l3 5 3-8 6 14" />,                              // peaks
  mullai: <><path d="M12 4 7 12h10L12 4Z" /><path d="M12 12v8" /><path d="M8 20h8" /></>, // tree
  marutham: <><path d="M6 20V9" /><path d="M12 20V6" /><path d="M18 20V9" /><path d="M6 9c2-2 2-4 0-5M12 6c2-2 2-4 0-5M18 9c2-2 2-4 0-5" strokeWidth="1.4" /></>, // stalks
  neytal: <><path d="M3 12c3-3 6 3 9 0s6 3 9 0" /><path d="M3 17c3-3 6 3 9 0s6 3 9 0" /></>, // waves
  palai: <><path d="M3 18c4-6 8-6 12 0" /><path d="M11 18c3-4 6-4 10 0" /><circle cx="18" cy="7" r="2.4" /></>, // dunes + sun
};

export function ThinaiIcon({ k, className = "h-5 w-5" }: { k: ThinaiKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[k]}
    </svg>
  );
}
