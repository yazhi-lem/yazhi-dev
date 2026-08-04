import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "தனியுரிமை • Privacy — Yazhi",
  description: "What Yazhi collects, what stays on your device, and how families should use the site.",
};

/** Plain-English privacy note. Deliberately written to be readable by a
    parent in two minutes — and kept honest: it describes what the site
    actually does today, not a boilerplate maximal license. When accounts
    move server-side, this page must be updated BEFORE anything is
    collected. (Tamil body copy pending the editorial review gate —
    see the note in lib/content.ts.) */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        ← யாழி · Yazhi
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">
        தனியுரிமை <span className="text-ivory-dim">·</span> Privacy
      </h1>
      <p className="mt-2 text-sm text-ivory-dim">Last updated: July 2026</p>

      <section className="mt-10 space-y-8 leading-relaxed text-ivory-dim">
        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">What we collect — and where it lives</h2>
          <p>
            When you join the network, the handle and phone number you enter are saved{" "}
            <strong className="text-ivory">only in your own browser</strong> (localStorage). They are not sent to
            or stored on our servers. Clearing your browser data removes them completely.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">Location</h2>
          <p>
            We show an auto-detected region label (like a city name) during onboarding. It comes from our hosting
            provider&apos;s network headers, resolved before our code runs. We read only that coarse label —{" "}
            <strong className="text-ivory">your IP address is never read, stored, or forwarded by us</strong>, and
            no precise location is ever collected.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">Links that leave this site</h2>
          <p>
            The WhatsApp, Discord, and GitHub links take you to third-party platforms with their own terms and
            privacy policies. Those platforms generally require users to be{" "}
            <strong className="text-ivory">13 or older</strong> (16 in some regions).
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">Children</h2>
          <p>
            Kids are welcome to explore the site — there is nothing here that requires an account. If you are under
            13, please only join the network or the chat communities together with a parent or guardian.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">If this changes</h2>
          <p>
            Yazhi is pre-launch. If accounts ever move to a server, we will update this page{" "}
            <strong className="text-ivory">before</strong> collecting anything, and say exactly what is stored and
            why.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">Contact</h2>
          <p>
            Questions? Reach us at{" "}
            <a
              href="https://github.com/yazhi-lem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
            >
              github.com/yazhi-lem
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
