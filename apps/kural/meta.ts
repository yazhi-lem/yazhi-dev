import type { WorkspaceMeta } from "@yazhi/workspace/types";

/** Kural · குரல் — a Tamil trader agent for both sides of the counter
    (PRD Part 4). Ships as its own workspace first; Kadai mounts the same
    modules as the business interface (decision 6, finding H5). */
export const KURAL_META: WorkspaceMeta = {
  id: "kural",
  name: "Kural",
  taName: "குரல்",
  tagline: {
    ta: "கடையின் சொந்தப் பதிவுகளிலிருந்து பதில் சொல்லும் தமிழ் வணிக முகவர் — உறுதியில்லையெனில் ஒருவரிடம் ஒப்படைக்கும்",
    en: "A Tamil trader agent that answers from the shop's own records — and hands over to a person when unsure",
  },
  tinai: "palai",
  runtime: "yazhi-api",
  languages: ["ta", "en"],
  base: "/kural",
  owner: "Parthiban",
  status: { ta: "உருவாக்கத்தில் · சீட்டு வகைப்படுத்தல், அண்ணாச்சி முகவர் உள்ளன", en: "Building · ticket triage, the Annachi agent and chat streaming exist" },
  pilot: { ta: "அரட்டை, மின்னஞ்சல் முன்னோட்டம் · டிசம்பர் 2026; தமிழ்க் குரல் · பிப்ரவரி 2027", en: "Chat and mail pilot · Dec 2026; Tamil voice · Feb 2027" },
  agents: ["Kural", "Annachi"],
  mountsIn: "kadai",
  views: [
    {
      id: "desk",
      label: { ta: "வாடிக்கையாளர் மேசை", en: "Customer desk" },
      purpose: {
        ta: "அரட்டையிலோ மின்னஞ்சலிலோ வாடிக்கையாளர் கேட்பதற்கு, கடையின் பதிவுகளிலிருந்து மட்டுமே பதில். இல்லையெனில் ஊழியரிடம் ஒப்படைப்பு.",
        en: "Customers ask on chat or mail; Kural answers only from the shop's records. Anything else is handed to staff.",
      },
      layout: { main: ["kural.chat"], aside: ["kural.knowledge", "workflow"] },
    },
    {
      id: "queue",
      label: { ta: "சீட்டு வரிசை", en: "Ticket queue" },
      purpose: {
        ta: "வரும் சீட்டுகள் வகை, முன்னுரிமை, பரிந்துரைப் பதிலுடன். அனுப்புவதற்கு முன் நீங்கள் ஒப்புக்கொள்ளுங்கள்.",
        en: "Incoming tickets with a category, priority and suggested reply. You approve before anything is sent.",
      },
      layout: { main: ["kural.queue"], aside: ["audit", "workflow"] },
    },
    {
      id: "returns",
      label: { ta: "திருப்புதல்", en: "Returns" },
      purpose: {
        ta: "அண்ணாச்சி திருப்பும் கோரிக்கையை முன்மொழிகிறார்; உரிமையாளர் உறுதிசெய்கிறார்; நிலையை வாடிக்கையாளர் பின்தொடரலாம்.",
        en: "Annachi proposes a return; the owner confirms; the customer can follow its status.",
      },
      layout: { main: ["kural.returns"], aside: ["workflow", "audit"] },
    },
    {
      id: "knowledge",
      label: { ta: "அறிவுத் தளம்", en: "Knowledge base" },
      purpose: {
        ta: "குரல் பதில் சொல்லக்கூடியவை இவை மட்டுமே: கேள்வி-பதில்கள், பொருட்பட்டியல், கொள்கைகள், ஆர்டர்கள்.",
        en: "All Kural may answer from: FAQs, the catalogue, policies and orders.",
      },
      layout: { main: ["kural.knowledge"], aside: ["about"] },
    },
  ],
  workflows: [
    {
      id: "pilot-demo",
      title: { ta: "முன்னோட்டச் செயல்விளக்கம்", en: "Pilot demo" },
      who: { ta: "கடை உரிமையாளருக்கு", en: "For a shop owner" },
      summary: { ta: "PRD-யின் இரண்டு நிமிடச் செயல்விளக்கம், தமிழில் முதலில்.", en: "The PRD's two-minute demo, Tamil first." },
      length: "2 min",
      steps: [
        { id: "order", view: "desk", title: { ta: "வாடிக்கையாளர் ஆர்டர் பற்றிக் கேட்கிறார்", en: "A customer asks about an order" }, hint: { ta: "“என் ஆர்டர் எங்கே? KD-1042” — கடையின் பதிவிலிருந்து பதில்.", en: "“Where is my order? KD-1042” — answered from the shop's records." } },
        { id: "handoff", view: "desk", title: { ta: "அறிவுத் தளத்துக்கு வெளியே கேள்வி → ஒப்படைப்பு", en: "A question outside the knowledge base → handoff" }, hint: { ta: "“தங்க நகை விற்பீர்களா?” ஐ முயலுங்கள்.", en: "Try “Do you sell gold jewellery?”" } },
        { id: "staff", view: "queue", title: { ta: "ஊழியர் வரிசையில் ஒப்படைப்பு", en: "The handoff in the staff queue" }, hint: { ta: "முழு உரையாடலுடன் சீட்டு.", en: "A ticket with the whole conversation." } },
        { id: "triage", view: "queue", title: { ta: "ஐந்து மின்னஞ்சல்கள் — ஒப்புக்கொண்டு அனுப்புங்கள்", en: "Five mails triaged — approve and send" }, hint: { ta: "T-203 இல் உள்ள கட்டளை போன்ற உரை தரவாக மட்டுமே கருதப்படுகிறது.", en: "The instruction-like text in T-203 is treated as data only." }, gate: true },
        { id: "return", view: "returns", title: { ta: "திருப்புதலைத் தொடங்கிப் பின்தொடருங்கள்", en: "Start a return and track it" }, hint: { ta: "அண்ணாச்சி முன்மொழிகிறார்; உரிமையாளர் உறுதிசெய்கிறார்.", en: "Annachi proposes; the owner confirms." }, gate: true },
      ],
    },
    {
      id: "morning",
      title: { ta: "காலை மின்னஞ்சல் வகைப்படுத்தல்", en: "Morning mail triage" },
      who: { ta: "கவுண்டர் ஊழியர்", en: "Counter staff" },
      summary: { ta: "இரவில் வந்தவற்றைத் தீர்த்தல், முன்னுரிமைப்படி.", en: "Clear what came in overnight, by priority." },
      length: "10 min",
      steps: [
        { id: "urgent", view: "queue", title: { ta: "அவசரச் சீட்டுகள் முதலில்", en: "Urgent tickets first" }, hint: { ta: "பணம் தொடர்பானவை உரிமையாளரிடம்.", en: "Anything about money goes to the owner." } },
        { id: "triage", view: "queue", title: { ta: "ஐந்து மின்னஞ்சல்கள் — ஒப்புக்கொண்டு அனுப்புங்கள்", en: "Five mails triaged — approve and send" }, hint: { ta: "T-203 இல் உள்ள கட்டளை போன்ற உரை தரவாக மட்டுமே கருதப்படுகிறது.", en: "The instruction-like text in T-203 is treated as data only." }, gate: true },
        { id: "kb", view: "knowledge", title: { ta: "பதில் இல்லாதவற்றை அறிவுத் தளத்தில் சேர்க்கக் குறியுங்கள்", en: "Note what the knowledge base lacked" }, hint: { ta: "அடுத்த முறை ஒப்படைப்பு குறையும்.", en: "Fewer handoffs next time." } },
      ],
    },
  ],
};
