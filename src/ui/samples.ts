import type { Source } from "./components/Citation";

/** Sample data for the UI library's demos and page templates.

    Rules for this file (Aram rule 1 — no claim without a source):
    - The only real texts here are the Thirukkural couplets quoted in the
      Yazhi Aram harness. English glosses are drafts pending scholar review.
    - Legal citations, prices, tickets and people are placeholders, written
      so they cannot be mistaken for real ones (bracketed, "Sample …").
    - Every template that shows this data also shows <Disclaimer kind="sample">. */

export interface Couplet {
  number: number;
  lines: [string, string];
  gloss: string;
}

export const KURALS: Couplet[] = [
  {
    number: 34,
    lines: ["மனத்துக்கண் மாசிலன் ஆதல் அனைத்தறன்", "ஆகுல நீர பிற."],
    gloss: "To be spotless in mind is the whole of virtue; all else is empty noise.",
  },
  {
    number: 423,
    lines: ["எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்", "மெய்ப்பொருள் காண்பது அறிவு."],
    gloss: "Whatever is heard, from whomever, wisdom is seeing the truth within it.",
  },
  {
    number: 467,
    lines: ["எண்ணித் துணிக கருமம் துணிந்தபின்", "எண்ணுவம் என்பது இழுக்கு."],
    gloss: "Think, then undertake the task; to start first and think after is a fault.",
  },
  {
    number: 664,
    lines: ["சொல்லுதல் யார்க்கும் எளிய அரியவாம்", "சொல்லிய வண்ணம் செயல்."],
    gloss: "Saying is easy for anyone; doing as one said is hard.",
  },
];

export const kuralSource = (c: Couplet, verified = false): Source => ({
  id: `kural-${c.number}`,
  title: "Thirukkural",
  locator: `Couplet ${c.number}`,
  excerpt: `${c.lines[0]} ${c.lines[1]}`,
  verified,
});

/** Placeholder statutory sources — bracketed so they read as layout, not law. */
export const SAMPLE_LEGAL_SOURCES: Source[] = [
  {
    id: "act-a",
    title: "[Sample Act name], [year]",
    locator: "Section [n] — [section heading]",
    excerpt: "[Exact text of the section, quoted from the stored India Code copy, appears here.]",
    verified: true,
  },
  {
    id: "rules-a",
    title: "[Sample Rules name], [year]",
    locator: "Rule [n]",
    excerpt: "[Exact text of the rule appears here.]",
    verified: false,
  },
];

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "new" | "triaged" | "waiting" | "resolved";
  opened: string;
  summary: string;
}

export const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "KD-1042",
    title: "Front-office printer shows offline",
    requester: "Reception desk",
    priority: "normal",
    status: "triaged",
    opened: "09:12",
    summary: "Printer powers on but no computer can reach it since this morning.",
  },
  {
    id: "KD-1043",
    title: "Staff member locked out after password reset",
    requester: "Accounts team",
    priority: "high",
    status: "new",
    opened: "09:40",
    summary: "Five wrong attempts after a reset; account now locked.",
  },
  {
    id: "KD-1039",
    title: "Shared drive is slow in the afternoon",
    requester: "Design team",
    priority: "low",
    status: "waiting",
    opened: "Yesterday",
    summary: "Copying large files takes several minutes after 2 pm.",
  },
];

export interface RunbookStep {
  id: string;
  text: string;
  /** changes a system — must pass a ConfirmGate */
  changes?: { impact: string; rollback: string; confirmWord?: string };
}

export const SAMPLE_RUNBOOK: RunbookStep[] = [
  { id: "s1", text: "Check the printer's network light and the cable at the switch." },
  { id: "s2", text: "Look up the printer's address in the asset list and ping it from the help-desk machine." },
  {
    id: "s3",
    text: "Restart the print spooler service on the office print server.",
    changes: { impact: "Print jobs queued right now will be cancelled.", rollback: "Start the service again; ask staff to resend jobs." },
  },
  {
    id: "s4",
    text: "Re-assign the printer a fixed address on the office router.",
    changes: {
      impact: "Router configuration for the front office.",
      rollback: "Restore the router config saved before the change.",
      confirmWord: "ROUTER",
    },
  },
];

export interface Product {
  id: string;
  name: string;
  taName: string;
  unit: string;
  price: number;
  stock: "in" | "low" | "out";
}

export const SAMPLE_PRODUCTS: Product[] = [
  { id: "p1", name: "Sample rice", taName: "அரிசி", unit: "5 kg bag", price: 0, stock: "in" },
  { id: "p2", name: "Sample gingelly oil", taName: "நல்லெண்ணெய்", unit: "1 litre", price: 0, stock: "low" },
  { id: "p3", name: "Sample jaggery", taName: "வெல்லம்", unit: "1 kg", price: 0, stock: "out" },
];

/** A maths item for the Guru hint ladder. The answer (x = 5) is never shown;
    the ladder stops one step short and hands back to the student. */
export const SAMPLE_PROBLEM = {
  prompt: "Solve for x:  3x + 5 = 20",
  hints: [
    "What is being done to x? It is multiplied by 3, then 5 is added.",
    "Undo the last operation first: take 5 away from both sides.",
    "You should now have 3x = 15. What single step leaves x on its own?",
  ],
  handBack: "Do that last step yourself, then check by putting your answer back into 3x + 5.",
};
