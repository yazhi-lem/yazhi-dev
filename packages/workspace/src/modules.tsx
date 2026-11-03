"use client";
import { Panel, Pill } from "@yazhi/bubble";
import { AuditPanel } from "./pettagam";
import type { ModuleContext, ModuleDef } from "./types";
import { WorkflowPanel } from "./workflow";

/** What the workspace is and where it stands — from the PRD's overview card. */
function AboutPanel({ ctx }: { ctx: ModuleContext }) {
  const { meta, t } = ctx;
  return (
    <Panel eyebrow={t({ ta: "பணியிடம்", en: "Workspace", te: "వర్క్‌స్పేస్" })} title={meta.name}>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-ivory-dim">{t({ ta: "உரிமையாளர்", en: "Product owner", te: "ఉత్పత్తి యజమాని" })}</dt>
        <dd className="text-ivory">{meta.owner}</dd>
        <dt className="text-ivory-dim">{t({ ta: "நிலை", en: "Status", te: "స్థితి" })}</dt>
        <dd className="text-ivory">{t(meta.status)}</dd>
        <dt className="text-ivory-dim">{t({ ta: "முன்னோட்டம்", en: "First pilot", te: "మొదటి పైలట్" })}</dt>
        <dd className="text-ivory">{t(meta.pilot)}</dd>
        <dt className="text-ivory-dim">{t({ ta: "முகவர்கள்", en: "Agents", te: "ఏజెంట్లు" })}</dt>
        <dd className="flex flex-wrap gap-1">
          {meta.agents.map((a) => (
            <Pill key={a} tone="accent">
              {a}
            </Pill>
          ))}
        </dd>
      </dl>
    </Panel>
  );
}

/** Modules every workspace can place: the guided workflow, the Pettagam
    audit log and the overview card. Workspaces spread these into their
    own module registry. */
export const SHARED_MODULES: Record<string, ModuleDef> = {
  workflow: {
    id: "workflow",
    title: { ta: "பணிவழி", en: "Workflow", te: "వర్క్‌ఫ్లో" },
    about: { ta: "படிப்படியான வழிகாட்டி", en: "Step-by-step guide through the workspace", te: "దశలవారీ మార్గదర్శి" },
    component: WorkflowPanel,
  },
  audit: {
    id: "audit",
    title: { ta: "தணிக்கைப் பதிவு", en: "Audit log (Pettagam)", te: "ఆడిట్ లాగ్" },
    about: { ta: "யார், என்ன, எப்போது", en: "Who did what, when (IST), with which sources", te: "ఎవరు, ఏమి, ఎప్పుడు" },
    component: AuditPanel,
  },
  about: {
    id: "about",
    title: { ta: "பணியிடம் பற்றி", en: "About this workspace", te: "ఈ వర్క్‌స్పేస్ గురించి" },
    about: { ta: "உரிமையாளர், நிலை, முகவர்கள்", en: "Owner, status, pilot and agents", te: "యజమాని, స్థితి, ఏజెంట్లు" },
    component: AboutPanel,
  },
};
