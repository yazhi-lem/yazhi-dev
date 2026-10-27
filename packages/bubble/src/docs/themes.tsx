"use client";
import type { ThinaiKey } from "../tinai/keys";
import { ENVIRONMENTS, ENV_BY_KEY, tone } from "../tinai/environments";
import { PERSONA_BY_KEY } from "../tinai/personas";
import { TinaiScope } from "../tinai/TinaiScope";
import { Section, TabPanel, Tabs, useTabsId } from "./kit";
import { EnvPreview, FigurePanel, SpringCurve, SpringPlayground, Swatches } from "./parts";
import { KaruStrip } from "./sangam";

const MOMENTS = ["empty", "loading", "success", "error", "confirm"] as const;

/** The five tinai, one at a time: choosing a tab dresses the whole page in
    that landscape. Each shows its palette in both modes, its persona, its
    motion and the Bubble UI wearing it, light and dark side by side. */
export function Themes({ tinai, onPick }: { tinai: ThinaiKey; onPick: (k: ThinaiKey) => void }) {
  const base = useTabsId();
  const env = ENV_BY_KEY[tinai];
  const persona = PERSONA_BY_KEY[tinai];
  return (
    <Section
      id="themes"
      eyebrow="Design"
      title="Themes"
      wide
      intro={
        <p>
          Sangam poetry sorts the world into five tinai, each a landscape with its own mood. Each is a whole theme here: a ground and an ink in
          light and dark, a way of moving, a living background, a figure and a persona with its own voice. Wrap any subtree in{" "}
          <code className="font-mono text-[0.9em]">{"<TinaiScope tinai=\"…\">"}</code> and everything inside takes the landscape; change it and
          every surface cross-fades. Choosing a theme below dresses this whole page in it.
        </p>
      }
    >
      <Tabs base={base} label="Themes" value={tinai} onChange={(id) => onPick(id as ThinaiKey)} items={ENVIRONMENTS.map((e) => ({ id: e.key, label: e.en, swatch: tone(e.key, "accent") }))} />
      <TabPanel base={base} value={tinai} className="mt-8">
        <div className="grid gap-10 xl:grid-cols-2">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-accent)]">{env.landscape}</p>
            <h3 className="mt-2 font-display text-5xl font-black">{env.en}</h3>
            <p className="mt-4 font-display text-xl">{env.signature}.</p>
            <p className="mt-2 max-w-md leading-relaxed text-[color:var(--env-text-dim)]">{env.mood}.</p>
            <dl className="mt-6 grid max-w-md gap-4 text-sm">
              {[
                ["Light", `${env.light}.`],
                ["Pointer", env.pointerWords],
                ["Use for", `${env.useFor}. Default home of ${env.apps.join(" and ")}.`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-accent)]">{k}</dt>
                  <dd className="mt-1 text-[color:var(--env-text-dim)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 self-center rounded-3xl border p-4 hair-lo sm:p-6">
            <FigurePanel key={tinai} tinai={tinai} />
          </div>
        </div>

        <div className="mt-14 rounded-3xl border p-5 hair-lo sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Persona</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h4 className="font-display text-3xl font-bold">{persona.name.en}</h4>
              <p className="mt-3 leading-relaxed">{persona.archetype}</p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--env-text-dim)]">{persona.voice}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tone">
                {persona.tone.map((t) => (
                  <li key={t} className="rounded-full border px-2.5 py-1 font-mono text-[11px] text-[color:var(--env-text-dim)] hair-lo">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <dl className="divide-y divide-[color:color-mix(in_oklab,var(--env-edge)_25%,transparent)] text-sm">
                {MOMENTS.map((m) => (
                  <div key={m} className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr]">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">{m}</dt>
                    <dd>{persona.microcopy[m].en}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ul className="space-y-1.5 text-sm">
                  {persona.do.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="font-mono text-[11px] text-[color:var(--env-accent)]">DO</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1.5 text-sm text-[color:var(--env-text-dim)]">
                  {persona.dont.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="font-mono text-[11px]">DON’T</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs text-[color:var(--env-text-dim)]">The persona and its copy are drafts; the Tamil versions in the theme files await native review.</p>
        </div>

        <div className="mt-14 space-y-8">
          {(["dark", "light"] as const).map((m) => (
            <div key={m}>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Palette · {m} · click to copy</h4>
              <div className="mt-3">
                <Swatches env={env} mode={m} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">In Bubble UI · dark and light</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(["dark", "light"] as const).map((m) => (
              <TinaiScope key={m} tinai={tinai} scheme={m} className="rounded-3xl border p-3 hair-lo">
                <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--env-text-dim)]">{m}</p>
                <EnvPreview env={env} />
              </TinaiScope>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="min-w-0">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">Motion</h4>
            <p className="mt-3 max-w-md text-sm">{env.motionWords}</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <SpringCurve spring={env.spring} />
              <div className="space-y-3 text-[11px] text-[color:var(--env-text-dim)]">
                <SpringPlayground spring={env.spring} label={env.en} />
                <p className="font-mono">
                  settle {env.settle}ms · ambient pace ×{env.pace}
                </p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <KaruStrip tinai={tinai} />
          </div>
        </div>
      </TabPanel>

      <h3 className="mt-16 font-display text-2xl font-bold">Pick by purpose</h3>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--env-text-dim)]">Choose the landscape from what the screen is for, never from a colour you like, and change it across whole sections, never inside one card.</p>
      <div className="mt-5 overflow-x-auto" data-lenis-prevent tabIndex={0} role="region" aria-label="Themes by purpose">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--env-text-dim)]">
            <tr className="border-b hair-lo">
              <th scope="col" className="py-2 pr-4 font-normal">Theme</th>
              <th scope="col" className="py-2 pr-4 font-normal">Persona</th>
              <th scope="col" className="py-2 pr-4 font-normal">Use for</th>
              <th scope="col" className="py-2 font-normal">Apps</th>
            </tr>
          </thead>
          <tbody>
            {ENVIRONMENTS.map((e) => (
              <tr key={e.key} className="border-b align-top hair-lo">
                <td className="py-3 pr-4">
                  <button type="button" onClick={() => onPick(e.key)} className="flex min-h-11 items-center gap-2 text-left hover:underline">
                    <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tone(e.key, "accent") }} />
                    {e.en}
                  </button>
                </td>
                <td className="py-3 pr-4">{PERSONA_BY_KEY[e.key].name.en}</td>
                <td className="py-3 pr-4 text-[color:var(--env-text-dim)]">{e.useFor}</td>
                <td className="py-3 text-[color:var(--env-text-dim)]">{e.apps.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
