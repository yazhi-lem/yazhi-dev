import type { Block } from "./types";
import { Bubble } from "../core/Bubble";
import { Stat } from "../core/Stat";
import { T } from "../core/Text";
import { PageHeader } from "../patterns/PageHeader";
import { BubbleCard } from "../patterns/BubbleCard";
import { StageTrack } from "../patterns/StageTrack";
import { FindingList } from "../patterns/FindingList";
import { KeyValue } from "../patterns/KeyValue";
import { DataTable } from "../patterns/DataTable";
import { EmptyState } from "../patterns/EmptyState";
import { Notice } from "../patterns/Notice";

/** Renders a list of spec blocks. Adding a block kind means: add it to
    the `Block` union, add a case here — the `never` check below makes
    the compiler list every place that still needs it. */
export function BubbleView({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <BlockView key={`${b.kind}-${i}`} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.kind) {
    case "header":
      return (
        <PageHeader
          title={b.title}
          eyebrow={b.eyebrow}
          description={b.description}
          tone={b.tone}
          crumbs={b.crumbs}
          pills={b.pills}
        />
      );
    case "notice":
      return <Notice tone={b.tone} badge={b.badge} title={b.title} body={b.body} />;
    case "stats":
      return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {b.items.map((s, i) => (
            <Stat key={i} {...s} />
          ))}
        </div>
      );
    case "cards":
      return (
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${b.columns === 2 ? "" : "xl:grid-cols-3"}`}>
          {b.items.map((c, i) => (
            <BubbleCard key={i} {...c} />
          ))}
        </div>
      );
    case "stages":
      return <StageTrack stages={b.stages} label={b.label} />;
    case "findings":
      return <FindingList items={b.items} empty={b.empty} />;
    case "keyvalue":
      return <KeyValue items={b.items} />;
    case "table":
      return <DataTable columns={b.columns} rows={b.rows} caption={b.caption} numeric={b.numeric} />;
    case "empty":
      return <EmptyState title={b.title} body={b.body} art={b.art} />;
    case "text":
      return (
        <p className="max-w-3xl text-ivory-dim">
          <T text={b.body} />
        </p>
      );
    case "section": {
      const inner = <BubbleView blocks={b.blocks} />;
      return (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl text-ivory">
              <T text={b.title} />
            </h2>
            {b.description && (
              <p className="mt-1 max-w-3xl text-sm text-ivory-dim">
                <T text={b.description} />
              </p>
            )}
          </div>
          {b.framed ? (
            <Bubble tone={b.tone} size="lg">
              {inner}
            </Bubble>
          ) : (
            inner
          )}
        </section>
      );
    }
    default: {
      const unreachable: never = b;
      return unreachable;
    }
  }
}
