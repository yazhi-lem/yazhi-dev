import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "எங்களைப் பற்றி • About — Yazhi",
  description: "Who is behind Yazhi, what we're building, and what the Awakening countdown means.",
};

/** The trust page: who we are, what we're building, what the countdown
    means, how to reach us. Answers the questions a parent (or anyone
    cautious) asks before sharing anything with an unfamiliar site. */
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-prose px-6 pb-24 pt-24 text-ivory">
      <Link href="/" className="text-sm text-ivory-dim transition-colors hover:text-ivory">
        ← யாழி · Yazhi
      </Link>

      <h1 className="mt-8 font-display text-3xl font-semibold">
        எங்களைப் பற்றி <span className="text-ivory-dim">·</span> About Yazhi
      </h1>

      <section className="mt-10 space-y-8 leading-relaxed text-ivory-dim">
        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">What is Yazhi?</h2>
          <p>
            Yazhi (யாழி) is a community initiative building{" "}
            <strong className="text-ivory">sovereign AI for Indian languages</strong> — starting from Tamil. In
            plain words: we teach computers to understand, read, and speak Tamil and every other Indian language,
            with the work done in the open, by the community, for the community.
          </p>
          <p className="mt-2">
            The name comes from the yazhi, the mythical guardian carved on Tamil temple pillars — part lion, part
            elephant — the keeper at the threshold.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">What we&apos;re building</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong className="text-ivory">Adhan (அதன்)</strong> — a 7B-parameter open AI model for 22+ Indian
              languages, one unified model from Tamil to Hindi, Bengali to Telugu.
            </li>
            <li>
              <strong className="text-ivory">Sangam (சங்கம்)</strong> — analysis of classical Tamil literature
              through the five landscapes (ஐந்திணை) of Sangam poetry. Live at{" "}
              <a
                href="https://sangam.yazhi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
              >
                sangam.yazhi.dev
              </a>
              .
            </li>
            <li>
              <strong className="text-ivory">Yazh Guardian (யாழ்)</strong> — an app protecting Tamil digital
              heritage and community knowledge.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">What is the countdown?</h2>
          <p>
            The timer on the home page counts down to the{" "}
            <strong className="text-ivory">Yazhi Awakening — 1 January 2027</strong>, our public launch: the day
            the models, tools, and community programs open fully. Nothing mysterious — just a launch date we hold
            ourselves to.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">The five landscapes on this site</h2>
          <p>
            The scenery you scroll through — mountain, forest, farmland, desert, sea — follows the ஐந்திணை, the
            five landscapes of 2,000-year-old Sangam poetry. Each landscape is paired with its classical poetic
            theme, exactly as taught in Tamil literature. It&apos;s our map: old land, new work.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold text-ivory">Who runs this &amp; how to reach us</h2>
          <p>
            Yazhi is run by the volunteers who build it, in the open. All our work is public at{" "}
            <a
              href="https://github.com/yazhi-lem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
            >
              github.com/yazhi-lem
            </a>{" "}
            — questions, issues, and hellos all welcome there. Also see our{" "}
            <Link href="/privacy" className="text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory">
              privacy note
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
