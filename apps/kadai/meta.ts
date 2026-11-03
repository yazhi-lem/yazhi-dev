import type { WorkspaceMeta } from "@yazhi/workspace/types";

/** Kadai · கடை — the business interface for shops: orders with Annachi,
    the shop's records, and Kural's customer desk and ticket queue mounted
    inside it (PRD decision 6). Whether Kadai becomes a product of its own
    is open until 30 Nov; this is its workspace either way. */
export const KADAI_META: WorkspaceMeta = {
  id: "kadai",
  name: "Kadai",
  taName: "கடை",
  tagline: {
    ta: "தமிழில் ஆர்டர் எடுக்கும் அருகிலுள்ள கடை — அண்ணாச்சியும் குரலும் உடன்",
    en: "A neighbourhood shop that runs its counter in Tamil — with Annachi and Kural",
  },
  tinai: "marutham",
  accent: "var(--gold)",
  runtime: "yazhi-api",
  languages: ["ta", "en"],
  base: "/kadai",
  owner: "Parthiban (Kural) · Valavan (product decision)",
  status: { ta: "முடிவுக்குக் காத்திருக்கிறது · 30 நவம்பர்", en: "Product decision open · 30 Nov" },
  pilot: { ta: "குரலுடன் · 2027", en: "With Kural inside · 2027" },
  agents: ["Annachi", "Kanaku", "Kural"],
  views: [
    {
      id: "counter",
      label: { ta: "கவுண்டர்", en: "Counter" },
      purpose: {
        ta: "வாடிக்கையாளர் தமிழில் சொல்கிறார்; அண்ணாச்சி பொருட்களைக் காட்டுகிறார்; கடை உறுதிசெய்கிறது. பணம் யாழி வழியாகச் செல்லாது.",
        en: "The customer says it in Tamil; Annachi shows what the shop has; the shop confirms. No money moves through Yazhi.",
      },
      layout: { main: ["kadai.counter"], aside: ["kadai.cart", "workflow"] },
    },
    {
      id: "orders",
      label: { ta: "ஆர்டர்கள்", en: "Orders" },
      purpose: {
        ta: "கடையின் ஆர்டர்கள். நிலை மாற்றம் ஒவ்வொன்றும் உங்கள் ஒப்புதலுடன் — குரல் வாடிக்கையாளருக்குச் சொல்வது இதையே.",
        en: "The shop's orders. Every status change waits for your yes — and it's what Kural tells the customer.",
      },
      layout: { main: ["kadai.orders"], aside: ["kadai.stock", "audit"] },
    },
    {
      id: "desk",
      label: { ta: "குரல் மேசை", en: "Kural desk" },
      purpose: {
        ta: "குரல், கடைக்குள்: வாடிக்கையாளர் அரட்டை, மின்னஞ்சல் வரிசை, அறிவுத் தளம் — அதே தொகுதிகள்.",
        en: "Kural, inside Kadai: the customer chat, the mail queue and the knowledge base — the same modules.",
      },
      layout: { main: ["kural.chat", "kural.queue"], aside: ["kural.knowledge", "workflow"] },
    },
    {
      id: "returns",
      label: { ta: "திருப்புதல்", en: "Returns" },
      purpose: {
        ta: "அண்ணாச்சி திருப்புதலை முன்மொழிகிறார்; நீங்கள் உறுதிசெய்கிறீர்கள்.",
        en: "Annachi proposes a return; you confirm it.",
      },
      layout: { main: ["kural.returns"], aside: ["audit", "about"] },
    },
  ],
  workflows: [
    {
      id: "take-order",
      title: { ta: "ஆர்டர் எடுத்தல்", en: "Take an order" },
      who: { ta: "கவுண்டர் ஊழியர்", en: "Counter staff" },
      summary: { ta: "தமிழில் கேட்டது முதல் கடை உறுதிசெய்தது வரை.", en: "From a request in Tamil to the shop's confirm." },
      length: "1 min",
      steps: [
        { id: "ask", view: "counter", title: { ta: "வாடிக்கையாளர் தமிழில் கேட்கிறார்", en: "The customer asks in Tamil" }, hint: { ta: "“அரிசி ஒரு மூட்டை வேணும்” ஐ அழுத்துங்கள்.", en: "Press “அரிசி ஒரு மூட்டை வேணும்”." } },
        { id: "add", view: "counter", title: { ta: "பொருட்களைச் சேருங்கள்", en: "Add the items" }, hint: { ta: "கையிருப்பு இல்லாதவை சேர்க்க முடியாது.", en: "Out-of-stock items can't be added." } },
        { id: "confirm", view: "counter", title: { ta: "கடை ஆர்டரை உறுதிசெய்கிறது", en: "The shop confirms the order" }, hint: { ta: "பணம் செலுத்தும் எண்ணம் மட்டும் பதிவாகும்.", en: "Only a payment intent is recorded." }, gate: true },
        { id: "track", view: "desk", title: { ta: "குரலிடம் ஆர்டர் நிலை கேளுங்கள்", en: "Ask Kural for the order's status" }, hint: { ta: "புதிய ஆர்டர் எண்ணைப் பயன்படுத்துங்கள்.", en: "Use the new order number." } },
      ],
    },
    {
      id: "counter-day",
      title: { ta: "கவுண்டர் நாள்", en: "A day at the counter" },
      who: { ta: "கடை உரிமையாளர்", en: "Shop owner" },
      summary: { ta: "ஆர்டர்கள், வாடிக்கையாளர் கேள்விகள், திருப்புதல்கள் — ஒரே இடத்தில்.", en: "Orders, customer questions and returns — in one place." },
      steps: [
        { id: "advance", view: "orders", title: { ta: "ஆர்டர்களை அடுத்த நிலைக்கு", en: "Move orders on" }, hint: { ta: "ஒவ்வொரு மாற்றமும் உங்கள் ஒப்புதலுடன்.", en: "Each change waits for your yes." }, gate: true },
        { id: "stock", view: "orders", title: { ta: "குறைந்த கையிருப்பைப் பாருங்கள்", en: "Check low stock" }, hint: { ta: "கனக்கு முகவர் காட்டுகிறார்.", en: "Kanaku shows it." } },
        { id: "triage", view: "desk", title: { ta: "மின்னஞ்சல் வரிசையைத் தீருங்கள்", en: "Clear the mail queue" }, hint: { ta: "ஒப்புக்கொண்டு அனுப்புங்கள்.", en: "Approve and send." }, gate: true },
        { id: "return", view: "returns", title: { ta: "திருப்புதலை உறுதிசெய்யுங்கள்", en: "Confirm a return" }, hint: { ta: "பணம் நீங்களே திருப்புங்கள்.", en: "You refund it yourself." }, gate: true },
      ],
    },
  ],
};
