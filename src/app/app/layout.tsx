import { appMetadata } from "@/components/app/metadata";
import { CircleProvider } from "@/components/circle/CircleProvider";

/** `/app` inherits its localised title, description, canonical and hreflang
    alternates from here; the page exports the same `generateMetadata`, so a
    `?b=` deep link and the bare route agree.

    The host reads the Circle session (Mission Control's account slot, the
    yazhi-api runtime gate), so it needs the same provider the product
    workspaces mount — without it `useCircleSession()` throws and the route
    renders a 500. `.bubble-root` gives the Bubble UI library its light and
    dark themes, exactly as `(workspaces)/layout.tsx` does. */
export const generateMetadata = appMetadata;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CircleProvider>
      <div className="bubble-root min-h-dvh">{children}</div>
    </CircleProvider>
  );
}
