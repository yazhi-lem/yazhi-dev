"use client";
import { LINKS } from "@/lib/content";

/** Floating invite to the community WhatsApp group. Fixed to the viewport,
    stacked above the LaunchTimer's bottom-left position on mobile / opposite
    corner on desktop so the two never overlap. */
export function WhatsAppButton() {
  return (
    <a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the Yazhi WhatsApp group"
      className="fixed bottom-4 left-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-6 w-6 fill-current"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2C6.486 2 2.01 6.477 2.01 11.995c0 1.997.583 3.855 1.588 5.418L2 22l4.71-1.564a9.947 9.947 0 0 0 5.294 1.517h.004c5.518 0 9.994-4.477 9.994-9.995C21.998 6.477 17.522 2.001 12.004 2Zm0 18.16h-.003a8.15 8.15 0 0 1-4.163-1.14l-.298-.177-3.114 1.033 1.048-3.033-.194-.312a8.146 8.146 0 0 1-1.258-4.353c0-4.518 3.66-8.187 8.176-8.187 2.183 0 4.234.85 5.777 2.393a8.117 8.117 0 0 1 2.394 5.788c0 4.518-3.66 8.188-8.365 8.188Z" />
      </svg>
    </a>
  );
}
