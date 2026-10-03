import type { Agent } from "./types";

/** Agents offered in /chat. Each is an agent_name_id served by yazhi-api
    (data/agents_config.yaml) and runs through its Five-Posture kernel.

    Offered only when every tool the agent holds is read-only. Agents that
    can change records — kural (ticket_create, ticket_update), vaathi
    (record score) — are left out of a public chat: Aram rule 3 requires
    an approved runbook and a human confirm before any system change.
    Nyaya stays out until its 12 Dec closed-beta gates pass.

    Tamil strings here are a DRAFT pending native-speaker review. */
export const AGENTS: Agent[] = [
  {
    id: "avai",
    name: { ta: "அவை", en: "Avai" },
    tone: "neytal",
    summary: {
      ta: "எழுத்துத் தொல்பொருள்கள், கல்வெட்டுகள், அகழாய்வுத் தளங்கள் — பட்டியல் பதிவுகளோடு தேடித் தரும்.",
      en: "Searches digitised artefacts, inscriptions and excavation sites of Indic scripts, with their catalogue records.",
    },
    rule: {
      ta: "ஒவ்வொரு கூற்றுக்கும் ஆதாரப் பதிவு; ஆதாரம் இல்லையெனில் “தெரியவில்லை”.",
      en: "Every claim names its source record. With no source, it says “I don't know”.",
    },
    status: { ta: "முன்னோட்டம் · பொது சோதனை நவம்பர் 21", en: "Preview · public beta 21 Nov" },
    prompts: [
      {
        label: { ta: "தமிழ்-பிராமி", en: "Tamil-Brahmi finds" },
        prompt: "Find artifacts with Tamil-Brahmi inscriptions from the Sangam period.",
      },
      {
        label: { ta: "கீழடி", en: "Keezhadi" },
        prompt: "Tell me about the Keezhadi excavation site and what was found there.",
      },
    ],
  },
  {
    id: "sevai",
    name: { ta: "சேவை", en: "Sevai" },
    tone: "marutham",
    summary: {
      ta: "அரசுத் திட்டங்களை விளக்கி, தகுதியைச் சரிபார்த்து, தேவையான ஆவணங்களைப் பட்டியலிடும்.",
      en: "Explains government schemes, checks eligibility and lists the documents you will need.",
    },
    rule: {
      ta: "அதிகாரப்பூர்வத் திட்ட உரையிலிருந்து மட்டுமே பதில்.",
      en: "Answers only from official scheme text it has retrieved.",
    },
    status: { ta: "முன்னோட்டம்", en: "Preview" },
    prompts: [
      {
        label: { ta: "உழவர் திட்டங்கள்", en: "Schemes for farmers" },
        prompt: "What government schemes are there for farmers?",
      },
      {
        label: { ta: "தகுதி", en: "Am I eligible?" },
        prompt:
          "I am a 62-year-old woman with an annual income of ₹90,000 in Tamil Nadu. Which schemes am I eligible for?",
      },
      {
        label: { ta: "கல்லூரி உதவி", en: "College support" },
        prompt: "Is there support for a girl from a government school joining college?",
      },
    ],
  },
];

export const AGENT_BY_ID: Record<string, Agent> = Object.fromEntries(AGENTS.map((a) => [a.id, a]));

export function getAgent(id: string): Agent | undefined {
  return AGENT_BY_ID[id];
}
