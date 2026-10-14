/** Per-endpoint payload schemas, checked before anything is forwarded.
    Unknown keys are rejected; strings are length-capped. Mirrors
    yazhi-api domains/telugu/models.py (which validates again). */
type Rule =
  | { t: "str"; max: number; min?: number; req?: boolean }
  | { t: "enum"; of: readonly string[]; req?: boolean }
  | { t: "int"; min: number; max: number; req?: boolean }
  | { t: "bool"; req?: boolean };

const S = (max: number, req = false, min = req ? 1 : 0): Rule => ({ t: "str", max, min, req });
const LANG = { t: "enum", of: ["te", "en"] } as const;

export const SCHEMAS: Record<string, Record<string, Rule>> = {
  "legal.ask": { question: S(2000, true), language: LANG },
  "legal.summary": { text: S(50000), sample_id: S(64), language: LANG },
  "legal.draft": {
    kind: { t: "enum", of: ["cheque_bounce_notice", "name_change_affidavit"], req: true },
    client_name: S(200, true), other_party: S(200), amount: S(50), old_name: S(200), place: S(100), date: S(20),
  },
  "health.intake": {
    name: S(200, true), age: { t: "int", min: 0, max: 130, req: true },
    sex: { t: "enum", of: ["female", "male", "other"], req: true }, phone: S(20),
    language: LANG, complaint: S(4000, true), consent: { t: "bool", req: true },
  },
  "health.explain": { note: S(8000, true) },
  "health.records": { q: S(100) },
};

export function validate(endpoint: string, payload: unknown): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const schema = SCHEMAS[endpoint];
  if (!schema) return { ok: false, error: "unknown endpoint" };
  const p = (payload ?? {}) as Record<string, unknown>;
  if (typeof p !== "object" || Array.isArray(p)) return { ok: false, error: "payload must be an object" };
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(p)) if (!(k in schema)) return { ok: false, error: `unexpected field: ${k}` };
  for (const [k, r] of Object.entries(schema)) {
    const v = p[k];
    if (v === undefined || v === null || v === "") {
      if (r.req) return { ok: false, error: `missing field: ${k}` };
      continue;
    }
    const bad = { ok: false as const, error: `invalid field: ${k}` };
    if (r.t === "str" && (typeof v !== "string" || v.length > r.max || v.length < (r.min ?? 0))) return bad;
    if (r.t === "enum" && !r.of.includes(v as string)) return bad;
    if (r.t === "int" && (!Number.isInteger(v) || (v as number) < r.min || (v as number) > r.max)) return bad;
    if (r.t === "bool" && typeof v !== "boolean") return bad;
    out[k] = v;
  }
  return { ok: true, value: out };
}
