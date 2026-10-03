import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BubbleDemo } from "@/components/bubble/BubbleDemo";
import { BubbleAnatomy } from "@/components/bubble/BubbleAnatomy";
import { LINKS } from "@/lib/content";
import { COMPONENTS, MODULES } from "@/ui/docs/catalog";
import { PAGE_TEMPLATES } from "@/ui/pages/catalog";

export const metadata: Metadata = {
  title: "Bubble UI — Yazhi builder docs",
  description:
    "The Yazhi Bubble UI and its UI library: components, modules and page templates for Yazhi apps that run on-device without internet and sign in with Circle.",
};

const TOC = [
  ["what", "What a bubble is"],
  ["library", "UI library"],
  ["anatomy", "Anatomy"],
  ["quickstart", "Quickstart"],
  ["manifest", "Manifest reference"],
  ["runtimes", "Runtimes & offline"],
  ["circle", "Circle sign-in"],
  ["permissions", "Permissions & insider risk"],
  ["collaborate", "Collaborating"],
  ["conduct", "Code of conduct"],
  ["status", "What's built, what's next"],
] as const;

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="display mt-16 scroll-mt-20 font-display text-2xl font-bold text-ivory first:mt-0 sm:text-3xl">
      <a href={`#${id}`} className="hover:text-gold">
        {children}
      </a>
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-relaxed text-ivory-dim">{children}</p>;
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-ivory/10 px-1.5 py-0.5 font-mono text-[0.85em] text-ivory">{children}</code>;
}

function Pre({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="mt-5 overflow-hidden rounded-xl border border-ivory/10 bg-black/50">
      {label && (
        <figcaption className="border-b border-ivory/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ivory-dim">
          {label}
        </figcaption>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-ivory" data-lenis-prevent>
        {children}
      </pre>
    </figure>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-ivory/10" data-lenis-prevent>
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-ivory/5 text-ivory">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-ivory-dim">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-ivory/10 align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MANIFEST_EXAMPLE = `{
  "schema": "yazhi.bubble/v0",
  "id": "circle.4f2c.tamil-tutor",
  "version": "0.1.0",
  "name": "Tamil Tutor",
  "taName": "தமிழ் ஆசான்",
  "description": "Explains Tamil grammar with one example per rule.",
  "accent": "#4f9d6b",
  "size": "m",
  "agent": {
    "systemPrompt": "You explain Tamil grammar…",
    "greeting": "வணக்கம்! Which rule shall we look at?",
    "fivePosture": true
  },
  "runtime": { "prefer": "device", "model": "adhan", "deviceModel": "adhan-kutty" },
  "permissions": ["yazhi-api", "clipboard"],
  "author": { "circleAccountId": "4f2c…", "name": "Your Name" },
  "createdAt": "2026-10-03T09:00:00Z",
  "updatedAt": "2026-10-03T09:00:00Z"
}`;

export default function BubbleDocsPage() {
  return (
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 pb-24 pt-10 lg:grid-cols-[14rem_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20 space-y-1 text-sm">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-gold">On this page</p>
            {TOC.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="block rounded px-2 py-1 text-ivory-dim hover:bg-ivory/5 hover:text-ivory">
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Builder docs · draft v0</p>
          <h1 className="display mt-2 font-display text-4xl font-black text-ivory sm:text-5xl">
            Bubble UI <span lang="ta" className="text-ivory-dim">· குமிழ்</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ivory-dim">
            Bubble UI is the surface Yazhi apps live in: one conversation canvas, a tray of bubbles, and your Circle
            account in the corner. Every bubble is an agent or tool a builder made. It runs on a model on your own
            device when there is no internet, and on Adhan through yazhi-api when there is.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/bubble/pages" className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-night hover:bg-bronze hover:text-ivory">
              Browse the UI library
            </Link>
            <a href="#quickstart" className="rounded-full border border-ivory/20 px-5 py-2 text-sm text-ivory hover:border-gold/60">
              Quickstart
            </a>
          </div>

          <section aria-label="Live Bubble UI" className="mt-10">
            <BubbleDemo />
            <p className="mt-3 text-xs text-ivory-dim/70">
              Live. Pick a bubble on the right. On-device bubbles need a local model server (see{" "}
              <a href="#runtimes" className="text-gold">Runtimes</a>); yazhi-api bubbles need you signed in with Circle.
            </p>
          </section>

          <H2 id="what">What a bubble is</H2>
          <P>
            A bubble is a small, self-describing app — today, an agent: a persona, a greeting, a runtime preference and
            the permissions it needs, all in one JSON manifest. The Bubble UI host reads the manifest, draws the bubble
            in the tray, and runs it. Builders compose a bubble&apos;s screens from the{" "}
            <a href="#library" className="text-gold">UI library</a>, sign it with their Circle account, and share it as a
            manifest.
          </P>
          <P>The design comes from five commitments in the founding sketch:</P>
          <ul className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              ["Runs without internet", "The host falls back to an on-device model whenever the browser is offline."],
              ["Local, on-device models", "A bubble can prefer the device even online, so its data never leaves the machine."],
              ["Circle identity", "One account signs you in to yazhi-api, signs the bubbles you build, and gates what they can call."],
              ["Insider-risk aware", "Bubbles get only the permissions they declare; session tokens never reach page code."],
              ["Rolls up to Capitol", "Planned: authorship and reviews flow to Capitol, the collective's operator console."],
              ["Zero cloud by default", "No foreign AI provider anywhere on a bubble's path — Adhan on yazhi-api, or your own device."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-xl border border-ivory/10 bg-night-2/60 p-4">
                <p className="font-semibold text-ivory">{t}</p>
                <p className="mt-1 text-sm text-ivory-dim">{d}</p>
              </li>
            ))}
          </ul>

          <H2 id="library">UI library</H2>
          <P>
            Yazhi UI is the component library every Yazhi app is built from, in three layers. Each layer uses only the one
            below, so a rule enforced by a component — a citation for every claim, a person in front of every system change
            — holds in every app that uses it.
          </P>
          <ul className="mt-5 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              ["/bubble/components", "Components", "கூறுகள்", `${COMPONENTS.length} primitives — bubble, pills, citations, guardrails, confirm gate, composer.`],
              ["/bubble/modules", "Modules", "தொகுதிகள்", `${MODULES.length} app blocks — cited answers, runbooks, hint ladder, verse reader, orders, consent.`],
              ["/bubble/pages", "Pages", "பக்கங்கள்", `${PAGE_TEMPLATES.length} full screens — ${PAGE_TEMPLATES.map((t) => t.app.name).join(", ")}.`],
            ].map(([href, en, ta, d]) => (
              <li key={href}>
                <Link href={href} className="block h-full rounded-xl border border-ivory/10 bg-night-2/60 p-4 transition hover:border-gold/50">
                  <p className="font-semibold text-ivory">
                    {en} <span lang="ta" className="font-normal text-ivory-dim">· {ta}</span>
                  </p>
                  <p className="mt-1 text-sm text-ivory-dim">{d}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Pre label="import">{`import { CitedAnswer, ConfirmGate, HintLadder, AppFrame } from "@/ui";`}</Pre>

          <H2 id="anatomy">Anatomy</H2>
          <P>The host has four parts. Their positions are fixed so every bubble feels at home in the same frame.</P>
          <BubbleAnatomy />
          <Table
            head={["Part", "What it does"]}
            rows={[
              ["Canvas", "The active bubble's conversation. Markdown replies; each reply notes which runtime produced it."],
              ["Tray", "Every installed bubble, packed as circles that never touch. Size (s, m, l) is set by the manifest. The tray is the library&apos;s BubbleTray module."],
              ["Composer", <>Message input and send <Code>▷</Code>. Enter sends; the square stops a stream.</>],
              ["Circle button", <>Bottom-left <Code>C</Code>. Open ring: signed out. Initials: signed in. Opens sign-in, join or your account.</>],
              ["Status", <>Header chips: <Code>online</Code>/<Code>offline</Code> and the runtime in use, with a settings panel for the on-device endpoint.</>],
            ]}
          />

          <H2 id="quickstart">Quickstart</H2>
          <ol className="mt-5 max-w-3xl list-decimal space-y-3 pl-5 text-ivory-dim marker:text-gold">
            <li>
              <span className="text-ivory">Sign in with Circle.</span> Press the <Code>C</Code> button. New builders can
              join with an email and password (18+, code of conduct). Your account lives in yazhi-api, not on this site.
            </li>
            <li>
              <span className="text-ivory">Start from the closest <Link href="/bubble/pages" className="text-gold">page template</Link>.</span>{" "}
              Copy it, keep its <Code>AppFrame</Code>, and swap the sample data for your app&apos;s.
            </li>
            <li>
              <span className="text-ivory">Compose from <Link href="/bubble/modules" className="text-gold">modules</Link>.</span>{" "}
              Reach for a <Link href="/bubble/components" className="text-gold">component</Link> only when no module fits —
              and keep the guardrail components (<Code>IDontKnow</Code>, <Code>ConfirmGate</Code>, <Code>Disclaimer</Code>) where
              the template has them.
            </li>
            <li>
              <span className="text-ivory">Describe the bubble</span> in a <Code>bubble.json</Code> manifest (below): name,
              persona, runtime, permissions.
            </li>
            <li>
              <span className="text-ivory">Test it in the Bubble UI</span> — on-device with a local model server, or on
              yazhi-api with your Circle session — then share it in Discord or a pull request.
            </li>
          </ol>

          <H2 id="manifest">Manifest reference</H2>
          <P>
            Schema <Code>yazhi.bubble/v0</Code>. v0 means the shape may still change; breaking changes will bump the
            version and the host will keep reading v0.
          </P>
          <Pre label="bubble.json">{MANIFEST_EXAMPLE}</Pre>
          <Table
            head={["Field", "Type", "Rules"]}
            rows={[
              [<Code key="a">id</Code>, "string", "Lowercase letters, digits, dots, dashes; ≤120. Convention: circle.<account>.<name>."],
              [<Code key="a">name</Code>, "string", "Required, ≤60."],
              [<Code key="a">taName</Code>, "string?", "Tamil name, ≤60. Draft until a native speaker reviews it."],
              [<Code key="a">description</Code>, "string", "≤280. Shown under the name and in the tray tooltip."],
              [<Code key="a">accent</Code>, "#rrggbb", "Bubble colour in the tray."],
              [<Code key="a">size</Code>, '"s" | "m" | "l"', "Tray size. Use l sparingly — it's a promise of importance."],
              [<Code key="a">agent.systemPrompt</Code>, "string", "Required, ≤8,000 characters."],
              [<Code key="a">agent.greeting</Code>, "string", "First message in a fresh thread, ≤1,000."],
              [<Code key="a">agent.fivePosture</Code>, "boolean", "Wraps the prompt in Context → Reason → Plan → Respond → Reflect."],
              [<Code key="a">runtime.prefer</Code>, '"device" | "yazhi-api"', "Tried first when online. Offline always means device."],
              [<Code key="a">runtime.model</Code>, "string", <>Model on yazhi-api; must be on the server allow-list (default <Code>adhan</Code>).</>],
              [<Code key="a">runtime.deviceModel</Code>, "string", "Model name your local server knows, e.g. a GGUF alias or an Ollama tag."],
              [<Code key="a">permissions</Code>, "string[]", <><Code>yazhi-api</Code>, <Code>clipboard</Code>. Nothing undeclared is granted.</>],
              [<Code key="a">author</Code>, "object?", "The publishing builder's Circle account. Absent on unsigned manifests."],
            ]}
          />

          <H2 id="runtimes">Runtimes & offline</H2>
          <Table
            head={["", "on-device", "yazhi-api"]}
            rows={[
              ["Path", "Browser → model server on this machine or LAN", "Browser → yazhi.dev /api/bubble/run → chat endpoint at YAZHI_API_URL"],
              ["Internet needed", "No", "Yes (or a LAN route to yazhi-api)"],
              ["Sign-in needed", "No", "Yes — a Circle session"],
              ["Model", <><Code key="m">runtime.deviceModel</Code> on your server</>, <><Code key="m">runtime.model</Code>, allow-listed</>],
              ["Data leaves the device", "No", "To the configured Yazhi endpoint only; the model allow-list keeps foreign models off this path"],
            ]}
          />
          <P>
            Today the yazhi-api runtime streams from the OpenAI-compatible endpoint configured as{" "}
            <Code>YAZHI_API_URL</Code> — the same path <Link href="/chat" className="text-gold">/chat</Link> uses.
            yazhi-api itself serves chat over unary gRPC only, so moving this onto yazhi-api with streaming is part of
            the v3 plan. The Circle gate, manifest checks and model allow-list are already enforced on yazhi.dev&apos;s
            side.
          </P>
          <P>
            The host chooses: if the browser is offline, or the bubble didn&apos;t declare <Code>yazhi-api</Code>, it
            runs on-device. Otherwise it follows <Code>runtime.prefer</Code>. You can override this per session in the
            runtime menu.
          </P>
          <P>
            The on-device endpoint is any OpenAI-compatible server. The default is <Code>http://localhost:8080/v1</Code>,
            llama.cpp&apos;s <Code>llama-server</Code> port. Your server must allow this site&apos;s origin (CORS).
          </P>
          <Pre label="run a local model">{`# llama.cpp — any GGUF model you have rights to run
llama-server -m ./models/your-model.gguf --port 8080

# or Ollama — allow the site's origin, then set the endpoint
# to http://localhost:11434/v1 in the runtime menu
OLLAMA_ORIGINS=https://yazhi.dev ollama serve`}</Pre>
          <P>
            Adhan Kutty is the intended default on-device model once it ships (scheduled 26 December 2026). Until then,
            point <Code>deviceModel</Code> at whatever local model you use.
          </P>

          <H2 id="circle">Circle sign-in</H2>
          <P>
            Your Circle account is a person in the yazhi-api IAM directory. yazhi.dev never keeps your password, and the
            browser never sees a token — only your name and email.
          </P>
          <Pre label="sign-in flow">{`browser ── POST /api/circle/signin {email, password} ──▶ yazhi.dev server
yazhi.dev ── gRPC yazhi.circle.v1.YazhiCircle/SignIn ──▶ yazhi-api
yazhi-api ◀── checks password + account and company are active
yazhi.dev ◀── { account, access_token (15 min), refresh_token (7 days) }
browser   ◀── Set-Cookie: yz_circle_at, yz_circle_rt (httpOnly, SameSite=Lax)
            + { account }   ← the only thing page code ever sees`}</Pre>
          <Table
            head={["Route", "Does"]}
            rows={[
              [<Code key="r">GET /api/circle/session</Code>, "Who is signed in. Refreshes an expired access token in place."],
              [<Code key="r">POST /api/circle/signin</Code>, "Email + password → session cookies."],
              [<Code key="r">POST /api/circle/signup</Code>, "Creates a Circle account on yazhi-api (18+, code of conduct), then signs in."],
              [<Code key="r">POST /api/circle/signout</Code>, "Clears the session cookies."],
              [<Code key="r">POST /api/bubble/run</Code>, "Runs a bubble on yazhi-api. Requires a session; validates the manifest."],
            ]}
          />
          <P>
            On yazhi-api, <Code>YazhiCircle</Code> issues session tokens (RS256, <Code>typ=circle_session</Code>).
            They authenticate ordinary calls, but they are not admin credentials: a signed-in builder cannot create,
            rotate or delete Circle accounts. Sign-in allows 5 failed attempts per email every 15 minutes.
          </P>
          <P>
            Deploying yazhi.dev? Set <Code>YAZHI_GRPC_TARGET</Code> (and <Code>YAZHI_GRPC_TLS=1</Code> off-loopback).
            Sign-up also needs <Code>YAZHI_CIRCLE_APP_KEY</Code> and <Code>YAZHI_CIRCLE_COMPANY_ID</Code> — see{" "}
            <Code>.env.example</Code>.
          </P>
          <P>
            <span className="text-ivory">Personal API keys are not issued yet.</span> yazhi-api creates one with every
            Circle account, but today any Circle key can manage every account in its company. yazhi.dev discards the key
            until yazhi-api scopes keys per person. Builders act through their session meanwhile.
          </P>

          <H2 id="permissions">Permissions & insider risk</H2>
          <P>
            Most harm to a platform like this comes from inside: a trusted bubble that reaches further than it said it
            would, or a builder&apos;s credential that does more than it should. The host is built so that a bubble cannot
            do either quietly.
          </P>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-ivory-dim marker:text-gold">
            <li>A bubble declares its permissions; the server refuses a yazhi-api run without <Code>yazhi-api</Code>.</li>
            <li>Session tokens live in httpOnly cookies — no bubble, script or extension on the page can read them.</li>
            <li>Every yazhi-api run carries the builder&apos;s Circle account id, so it can be traced to a person.</li>
            <li>The server allow-lists models. A manifest cannot point yazhi.dev at a foreign provider.</li>
            <li>Session tokens stop working the moment an account or its company is deactivated.</li>
          </ul>

          <H2 id="collaborate">Collaborating</H2>
          <P>
            Today: build your screens from the UI library, write a <Code>bubble.json</Code>, and share both in{" "}
            <a href={LINKS.discord} className="text-gold">Discord</a> or as a pull request. Anyone can fork a manifest and re-sign it with their own account; keep the
            original author in the history you share alongside it. New components and modules come in through pull
            requests to <Code>src/ui</Code>, reviewed like any other code.
          </P>
          <P>
            Next: a shared registry on yazhi-api, Circle-signed publishing, reviews before a bubble goes public, and
            builder activity rolling up to Capitol. The plan is in{" "}
            <a href={`${LINKS.github}/yazhi-dev/blob/main/docs/PROPOSAL-YAZHI-DEV-V3.md`} className="text-gold">
              the Yazhi Dev v3 proposal
            </a>
            .
          </P>

          <H2 id="conduct">Code of conduct</H2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ivory-dim/70">Draft — pending review before Dev Spaces opens</p>
          <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-ivory-dim marker:text-gold">
            <li>Build for the people who will use it. Say plainly what your bubble does and doesn&apos;t do.</li>
            <li>No claim without a source. A bubble that can&apos;t support an answer says it doesn&apos;t know.</li>
            <li>Data stays home. Don&apos;t route users&apos; words to services outside India or outside their device.</li>
            <li>Children are not your users here. Nothing for under-18s without the Yazh family flow and its safeguards.</li>
            <li>No content that demeans any caste, religion, region, language or gender.</li>
            <li>Credit others. Keep the author of anything you fork, and say what you changed.</li>
            <li>Report problems — in a bubble or in a person&apos;s conduct — to the moderators in Discord.</li>
          </ol>

          <H2 id="status">What&apos;s built, what&apos;s next</H2>
          <Table
            head={["Piece", "State"]}
            rows={[
              ["Bubble UI host — canvas, packed tray, composer, Circle button", "Built"],
              ["On-device runtime (OpenAI-compatible, browser → localhost)", "Built"],
              ["yazhi-api runtime via /api/bubble/run, Circle-gated, model allow-list", "Built — streams from YAZHI_API_URL (OpenAI-compatible)"],
              ["Streaming chat served by yazhi-api itself (gRPC)", "Proposed — Yazhi Dev v3"],
              ["Circle sign-in / join / sign-out on yazhi.dev", "Built — needs YAZHI_GRPC_TARGET"],
              ["YazhiCircle on yazhi-api (sessions, refresh, liveness)", "Built on a branch — awaiting review"],
              [`Yazhi UI — ${COMPONENTS.length} components, ${MODULES.length} modules, ${PAGE_TEMPLATES.length} page templates`, "Built — sample data only"],
              ["Child-facing Yazh screens in the library", "Held — until counsel sign-off (Aram rule 4)"],
              ["Shared bubble registry, publishing, reviews", "Proposed — Yazhi Dev v3"],
              ["Personal API keys for builders", "Blocked — needs per-person key scoping on yazhi-api"],
              ["Capitol roll-up of builder activity", "Proposed — Yazhi Dev v3"],
            ]}
          />
        </main>
      </div>
  );
}
