/** The Yazhi Manifesto — the long-form statement of why the initiative
    exists. Kept as data so the About page can render it without hard-coding
    English prose in JSX (the About page is a migrated i18n file).

    The title, tagline, subtitle and quote are translated in the site
    catalogue (`site.about.manifesto.*`). The section bodies below are the
    English original; the About page marks their container `lang="en"` and
    shows a note that translation is pending. */

export type ManifestoBullet = {
  label: string;
  text: string;
};

export type ManifestoPillar = {
  title: string;
  paragraph: string;
  bullets: ManifestoBullet[];
};

export type ManifestoSection = {
  title: string;
  paragraphs?: string[];
  pillars?: ManifestoPillar[];
  bullets?: ManifestoBullet[];
};

export const MANIFESTO = {
  sections: [
    {
      title: "1. Why We Exist",
      paragraphs: [
        "Artificial intelligence is rewriting how humanity thinks, learns, and governs—yet it is being built on an extractive foundation. For hundreds of millions of Indians, the digital future arrives in a foreign tongue, processed on foreign servers, and governed by foreign corporate interests.",
        'Languages with over two thousand years of unbroken literary and philosophical heritage are treated as a rounding error. Our children lose their mother tongue at the front door because every screen assumes English literacy and typing. Meanwhile, our developers and citizens pay a heavy "token tax"—facing higher costs, slower speeds, and fractured grammar simply because English-trained models shatter agglutinative Indian languages like Tamil and Telugu.',
        "We refuse to rent our intelligence or our cultural memory from overseas monopolies. Yazhi is not a startup; it is a movement with a business model—bootstrapped, sustainable, and owned by the people who build it.",
      ],
    },
    {
      title: "2. Our Three Founding Pillars",
      pillars: [
        {
          title: "I. Sovereign by Design",
          paragraph:
            "Digital sovereignty is a hard architectural constraint, not a marketing slogan.",
          bullets: [
            {
              label: "Zero Foreign Dependencies",
              text: "We enforce zero foreign API calls in production at the network layer.",
            },
            {
              label: "Data on Indian Soil",
              text: "Indian data remains on Indian infrastructure.",
            },
            {
              label: "Permanent Intelligence",
              text: "We reject shallow, stateless, transient AI wrappers. Through our Core Domain architecture, intelligence is anchored in persistent user context, explicit reasoning trails, and rigorous validation.",
            },
          ],
        },
        {
          title: "II. Tamil First, Indic Next",
          paragraph:
            "Native-language AI cannot be achieved through post-hoc translation.",
          bullets: [
            {
              label: "Built for Real Registers",
              text: "We build natively for the registers real people actually speak and read—conversational, administrative/government, and classical Tamil—with Indic languages to follow.",
            },
            {
              label: "Voice-First & Inclusive",
              text: "Technology must meet humans where they are, starting with voice-first experiences for children who cannot yet read or type.",
            },
            {
              label: "Preserving Living Heritage",
              text: "Through Open Sangam, we digitize and make conversational two millennia of classical Tamil literature so our heritage thrives in the open-source digital era.",
            },
          ],
        },
        {
          title: "III. A Commune, Not a Corporation",
          paragraph:
            'We reject the "burn and exit" venture capital playbook in favor of a "Build and Sustain" model.',
          bullets: [
            {
              label: "Labor as Equity",
              text: "We do not hire disposable resources; we onboard partners. Those who build the technology own the value it creates.",
            },
            {
              label: "Value Circulation",
              text: "Profit is a tool for independence, never extraction. Surplus circulates inward—reinvested into sovereign R&D, distributed as dividends to worker-stakeholders, and granted to aligned community movements.",
            },
            {
              label: "Radical Transparency",
              text: "Open books, open governance, and open-source foundations. Founders act as stewards, volunteers as specialized nodes, and interns as apprentice founders.",
            },
          ],
        },
      ],
    },
    {
      title: "3. What We Are Building",
      paragraphs: ["Three products, one sovereign foundation:"],
      bullets: [
        {
          label: "Yazh (Product)",
          text: "A Tamil-native, multi-agent AI companion and platform (spanning government services, education, news, literature, and culture) running entirely on sovereign infrastructure.",
        },
        {
          label: "Adhan (Research)",
          text: "An open, sovereign Indic Large Language Model engineered for deep grammatical, colloquial, and domain mastery without the foreign token tax.",
        },
        {
          label: "Sangam (Heritage)",
          text: "An open-source classical Tamil corpus and reader that bridges 2,000 years of literature with modern conversational intelligence.",
        },
      ],
    },
    {
      title: "4. Our Inviolable Commitments",
      paragraphs: [
        "To protect our mission from drift or compromise, we bind ourselves to four non-negotiable rules:",
      ],
      bullets: [
        {
          label: "No Surveillance",
          text: "We will never sell or monetize user data or metadata.",
        },
        {
          label: "No Manipulation",
          text: "We will never deploy dark patterns designed to addict or deceive users.",
        },
        {
          label: "No Exploitation",
          text: "We reject crunch culture, unpaid overtime, and extreme wealth disparity within our collective.",
        },
        {
          label: "No Opacity",
          text: "We never hide financial realities or strategic shifts from the community that sustains us.",
        },
      ],
    },
    {
      title: "5. The Call to Build",
      paragraphs: [
        "We are forging a resilient generation of Forward Deployed Engineers, scholars, and builders who grow by teaching and lead through stewardship. Whether you are an engineer, a Tamil scholar, a public servant, or a believer in self-reliant technology—there is a place for you in the commune.",
        "Build with us. Own what you build. Keep our future sovereign.",
      ],
    },
  ] satisfies ManifestoSection[],
};
