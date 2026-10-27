import Link from "next/link";
import { Code, Pre, Section, Table } from "@yazhi/bubble/docs/kit";
import type { TocGroup } from "@yazhi/bubble/docs/Library";
import { COMPONENTS, MODULES } from "@yazhi/bubble/docs/catalog";
import { PAGE_TEMPLATES } from "@yazhi/bubble/pages/catalog";
import { LINKS } from "@/lib/content";
import { BubbleDemo } from "./BubbleDemo";
import { BubbleAnatomy } from "./BubbleAnatomy";

/** yazhi.dev's builder docs, set after the library on /bubble: the live
    host, how to make a bubble, and how it runs, signs in and is governed. */

export const BUILD_TOC: TocGroup = {
  group: "Build",
  items: [
    ["playground", "Playground"],
    ["quickstart", "Quickstart"],
    ["manifest", "Manifest"],
    ["runtimes", "Runtimes"],
    ["circle", "Circle sign-in"],
    ["permissions", "Permissions"],
    ["conduct", "Code of conduct"],
    ["status", "Status"],
  ],
};

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
    "greeting": "Which rule shall we look at?",
    "fivePosture": true
  },
  "runtime": { "prefer": "device", "model": "adhan", "deviceModel": "adhan-kutty" },
  "permissions": ["yazhi-api", "clipboard"],
  "author": { "circleAccountId": "4f2c…", "name": "Your Name" },
  "createdAt": "2026-10-03T09:00:00Z",
  "updatedAt": "2026-10-03T09:00:00Z"
}`;

const link = "underline decoration-[color:var(--env-edge)] underline-offset-2 hover:text-[color:var(--env-accent)]";

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[68ch] leading-relaxed text-[color:var(--env-text-dim)]">{children}</p>;
}

export function BuildDocs() {
  return (
    <>
      <Section
        id="playground"
        eyebrow="Build"
        title="Playground"
        wide
        intro={
          <p>
            The Bubble UI host, live: a conversation canvas, a tray of bubbles and the composer led by Mission Control. Pick a bubble in the tray.
            On-device bubbles need a local model server (see Runtimes); yazhi-api bubbles need a Circle account.
          </p>
        }
      >
        <BubbleDemo />
        <BubbleAnatomy />
        <Table
          head={["Part", "What it does"]}
          rows={[
            ["Canvas", "The active bubble’s conversation. Markdown replies; each notes which runtime produced it."],
            ["Tray", "Every installed bubble, packed as circles that never touch. Size (s, m, l) is set by the manifest."],
            ["Composer", <>Message input and send <Code>▷</Code>. Enter sends; the square stops a stream.</>],
            ["Mission Control", "Bottom left, the Yazhi mark in a bubble. Asleep until a Circle account is signed in; awake, it opens the account, theme and places."],
            ["Status", <>Header chips: <Code>online</Code>/<Code>offline</Code> and the runtime in use.</>],
          ]}
        />
      </Section>

      <Section id="quickstart" eyebrow="Build" title="Quickstart">
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-[color:var(--env-text-dim)] marker:text-[color:var(--env-accent)]">
          <li>
            <span className="text-[color:var(--env-text)]">Create a Circle account.</span> Press Mission Control. New builders join with an email and
            password (18+, code of conduct); Mission Control wakes once the account exists. The account lives in yazhi-api, not on this site.
          </li>
          <li>
            <span className="text-[color:var(--env-text)]">Start from the closest <a href="#templates" className={link}>template</a>.</span> Keep its{" "}
            <Code>AppFrame</Code> and swap the sample data for your app’s.
          </li>
          <li>
            <span className="text-[color:var(--env-text)]">Compose from <a href="#modules" className={link}>modules</a>.</span> Reach for a{" "}
            <a href="#components" className={link}>component</a> only when no module fits — and keep the guardrails (<Code>IDontKnow</Code>,{" "}
            <Code>ConfirmGate</Code>, <Code>Disclaimer</Code>) where the template has them.
          </li>
          <li>
            <span className="text-[color:var(--env-text)]">Pick its <a href="#themes" className={link}>theme</a></span> from what the app is for, and
            check it in light and dark.
          </li>
          <li>
            <span className="text-[color:var(--env-text)]">Describe the bubble</span> in a <Code>bubble.json</Code> manifest: name, persona, runtime,
            permissions. Test it in the playground, then share it in Discord or a pull request.
          </li>
        </ol>
      </Section>

      <Section
        id="manifest"
        eyebrow="Build"
        title="Manifest"
        wide
        intro={
          <p>
            Schema <Code>yazhi.bubble/v0</Code>. v0 means the shape may still change; breaking changes will bump the version and the host will keep
            reading v0. <Code>taName</Code> is the bubble’s Tamil name, a draft until a native speaker reviews it.
          </p>
        }
      >
        <Pre label="bubble.json">{MANIFEST_EXAMPLE}</Pre>
        <Table
          head={["Field", "Type", "Rules"]}
          rows={[
            [<Code key="a">id</Code>, "string", "Lowercase letters, digits, dots, dashes; ≤120. Convention: circle.<account>.<name>."],
            [<Code key="a">name</Code>, "string", "Required, ≤60."],
            [<Code key="a">taName</Code>, "string?", "Tamil name, ≤60. Draft until a native speaker reviews it."],
            [<Code key="a">description</Code>, "string", "≤280. Shown under the name and in the tray tooltip."],
            [<Code key="a">accent</Code>, "#rrggbb", "Bubble colour in the tray."],
            [<Code key="a">size</Code>, '"s" | "m" | "l"', "Tray size. Use l sparingly — it’s a promise of importance."],
            [<Code key="a">agent.systemPrompt</Code>, "string", "Required, ≤8,000 characters."],
            [<Code key="a">agent.greeting</Code>, "string", "First message in a fresh thread, ≤1,000."],
            [<Code key="a">agent.fivePosture</Code>, "boolean", "Wraps the prompt in Context → Reason → Plan → Respond → Reflect."],
            [<Code key="a">runtime.prefer</Code>, '"device" | "yazhi-api"', "Tried first when online. Offline always means device."],
            [<Code key="a">runtime.model</Code>, "string", <>Model on yazhi-api; must be on the server allow-list (default <Code>adhan</Code>).</>],
            [<Code key="a">runtime.deviceModel</Code>, "string", "Model name your local server knows, e.g. a GGUF alias or an Ollama tag."],
            [<Code key="a">permissions</Code>, "string[]", <><Code>yazhi-api</Code>, <Code>clipboard</Code>. Nothing undeclared is granted.</>],
            [<Code key="a">author</Code>, "object?", "The publishing builder’s Circle account. Absent on unsigned manifests."],
          ]}
        />
      </Section>

      <Section id="runtimes" eyebrow="Build" title="Runtimes and offline" wide>
        <Table
          head={["Runtime", "On-device", "yazhi-api"]}
          rows={[
            ["Path", "Browser → model server on this machine or LAN", "Browser → yazhi.dev /api/bubble/run → chat endpoint at YAZHI_API_URL"],
            ["Internet needed", "No", "Yes (or a LAN route to yazhi-api)"],
            ["Sign-in needed", "No", "Yes — a Circle session"],
            ["Model", <><Code key="m">runtime.deviceModel</Code> on your server</>, <><Code key="m">runtime.model</Code>, allow-listed</>],
            ["Data leaves the device", "No", "To the configured Yazhi endpoint only; the allow-list keeps foreign models off this path"],
          ]}
        />
        <P>
          The host chooses: if the browser is offline, or the bubble didn’t declare <Code>yazhi-api</Code>, it runs on-device. Otherwise it follows{" "}
          <Code>runtime.prefer</Code>. Today the yazhi-api runtime streams from the OpenAI-compatible endpoint configured as <Code>YAZHI_API_URL</Code>
          , the same path <Link href="/chat" className={link}>Yazhi Chat</Link> uses; moving it onto yazhi-api’s own streaming is part of the v3
          plan.
        </P>
        <P>
          The on-device endpoint is any OpenAI-compatible server. The default is <Code>http://localhost:8080/v1</Code>, llama.cpp’s{" "}
          <Code>llama-server</Code> port. Your server must allow this site’s origin (CORS). Adhan Kutty is the intended default on-device model once it
          ships (scheduled 26 December 2026).
        </P>
        <Pre label="run a local model">{`# llama.cpp — any GGUF model you have rights to run
llama-server -m ./models/your-model.gguf --port 8080

# or Ollama — allow the site's origin, then set the endpoint
# to http://localhost:11434/v1 in Mission Control
OLLAMA_ORIGINS=https://yazhi.dev ollama serve`}</Pre>
      </Section>

      <Section
        id="circle"
        eyebrow="Build"
        title="Circle sign-in"
        wide
        intro={
          <p>
            A Circle account is a person in the yazhi-api IAM directory, and creating one is what wakes Mission Control. yazhi.dev never keeps your
            password, and the browser never sees a token — only your name and email.
          </p>
        }
      >
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
          Session tokens (RS256, <Code>typ=circle_session</Code>) authenticate ordinary calls but are not admin credentials. Sign-in allows 5 failed
          attempts per email every 15 minutes. Deploying yazhi.dev? Set <Code>YAZHI_GRPC_TARGET</Code> (and <Code>YAZHI_GRPC_TLS=1</Code>{" "}
          off-loopback); sign-up also needs <Code>YAZHI_CIRCLE_APP_KEY</Code> and <Code>YAZHI_CIRCLE_COMPANY_ID</Code> — see{" "}
          <Code>.env.example</Code>. Personal API keys are not issued yet: yazhi-api creates one with every account, but until keys are scoped per
          person yazhi.dev discards it, and builders act through their session.
        </P>
      </Section>

      <Section
        id="permissions"
        eyebrow="Build"
        title="Permissions and insider risk"
        intro={<p>Most harm to a platform like this comes from inside. The host is built so that a bubble cannot reach further than it said, quietly.</p>}
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-[color:var(--env-text-dim)] marker:text-[color:var(--env-accent)]">
          <li>A bubble declares its permissions; the server refuses a yazhi-api run without <Code>yazhi-api</Code>.</li>
          <li>Session tokens live in httpOnly cookies — no bubble, script or extension on the page can read them.</li>
          <li>Every yazhi-api run carries the builder’s Circle account id, so it can be traced to a person.</li>
          <li>The server allow-lists models. A manifest cannot point yazhi.dev at a foreign provider.</li>
          <li>Session tokens stop working the moment an account or its company is deactivated.</li>
        </ul>
        <P>
          Share bubbles today in <a href={LINKS.discord} className={link}>Discord</a> or as a pull request; new components and modules come in as pull
          requests to <Code>packages/bubble</Code>. Next: a shared registry on yazhi-api, Circle-signed publishing and reviews — see{" "}
          <a href={`${LINKS.github}/yazhi-dev/blob/main/docs/PROPOSAL-YAZHI-DEV-V3.md`} className={link}>
            the Yazhi Dev v3 proposal
          </a>
          .
        </P>
      </Section>

      <Section id="conduct" eyebrow="Build" title="Code of conduct" intro={<p>Draft — pending review before Dev Spaces opens.</p>}>
        <ol className="max-w-3xl list-decimal space-y-2 pl-5 text-[color:var(--env-text-dim)] marker:text-[color:var(--env-accent)]">
          <li>Build for the people who will use it. Say plainly what your bubble does and doesn’t do.</li>
          <li>No claim without a source. A bubble that can’t support an answer says it doesn’t know.</li>
          <li>Data stays home. Don’t route users’ words to services outside India or outside their device.</li>
          <li>Children are not your users here. Nothing for under-18s without the Yazh family flow and its safeguards.</li>
          <li>No content that demeans any caste, religion, region, language or gender.</li>
          <li>Credit others. Keep the author of anything you fork, and say what you changed.</li>
          <li>Report problems — in a bubble or in a person’s conduct — to the moderators in Discord.</li>
        </ol>
      </Section>

      <Section id="status" eyebrow="Build" title="What’s built, what’s next" wide>
        <Table
          head={["Piece", "State"]}
          rows={[
            ["Bubble UI host — canvas, packed tray, composer, Mission Control", "Built"],
            ["Light and dark themes for every landscape", "Built"],
            ["On-device runtime (OpenAI-compatible, browser → localhost)", "Built"],
            ["yazhi-api runtime via /api/bubble/run, Circle-gated, model allow-list", "Built — streams from YAZHI_API_URL"],
            ["Streaming chat served by yazhi-api itself (gRPC)", "Proposed — Yazhi Dev v3"],
            ["Circle sign-in / join / sign-out on yazhi.dev", "Built — needs YAZHI_GRPC_TARGET"],
            [`UI library — ${COMPONENTS.length} components, ${MODULES.length} modules, ${PAGE_TEMPLATES.length} templates`, "Built — sample data only"],
            ["Child-facing Yazh screens in the library", "Held — until counsel sign-off (Aram rule 4)"],
            ["Shared bubble registry, publishing, reviews", "Proposed — Yazhi Dev v3"],
            ["Personal API keys for builders", "Blocked — needs per-person key scoping on yazhi-api"],
          ]}
        />
      </Section>
    </>
  );
}
