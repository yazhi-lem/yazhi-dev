import Link from "next/link";
import { toneStyle, type Tone } from "../tone";
import { Pill } from "../core/Pill";
import { T, type BiText } from "../core/Text";

export interface Crumb {
  label: string;
  href?: string;
}

export interface PillSpec {
  label: string;
  tone?: Tone;
  pulse?: boolean;
}

export interface PageHeaderProps {
  title: BiText;
  eyebrow?: string;
  description?: BiText;
  tone?: Tone;
  crumbs?: Crumb[];
  pills?: PillSpec[];
}

export function PageHeader({ title, eyebrow, description, tone = "gold", crumbs, pills }: PageHeaderProps) {
  return (
    <header style={toneStyle(tone)} className="space-y-4">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="text-sm text-ivory-dim">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-ivory">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ivory">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] ybi-tone-text">{eyebrow}</p>
      )}
      <h1 className="font-display text-4xl font-bold text-ivory sm:text-5xl">
        <T text={title} display separator=" " />
      </h1>
      {description && (
        <p className="max-w-3xl text-lg text-ivory-dim">
          <T text={description} separator=" — " />
        </p>
      )}
      {pills && pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <Pill key={p.label} {...p} />
          ))}
        </div>
      )}
    </header>
  );
}
