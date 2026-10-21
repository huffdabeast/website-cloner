import { asset } from "@/lib/skyfall/media";

const photos = {
  kaheer: asset("assets/team/kaheer-suleman.jpg"),
  sam: asset("assets/team/sam-pasupalak.jpg"),
  sumit: asset("assets/team/sumit-pasupalak.jpg"),
};

export const siteBase = {
  name: "Skyfall AI",
  tagline: "Engineering World Models for the autonomous enterprise.",
  nav: [
    { label: "Research", href: "#research" },
    { label: "SKY-001", href: "#sky-001" },
    { label: "Team", href: "#team" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "X", href: "https://x.com/skyfallai" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/skyfallai/posts/" },
  ],
  contactEmail: "[CONTACT EMAIL]",
  officeAddress: "[OFFICE ADDRESS]",
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
  ],
  year: 2026,
};

export const site = { ...siteBase, tagline: "Engineering World Models for the Autonomous Enterprise." };

export const homeHeroBase = {
  title: "Autonomous Business for the Post-Monolithic Era",
  lede: "We're enabling the future where an entire business can operate autonomously.",
  primaryCta: { label: "Meet SKY-001", href: "#sky-001" },
  secondaryCta: { label: "Read our research", href: "#research" },
};

export const homeHero = {
  ...homeHeroBase,
  title: "Autonomous Business for the Post-scarcity era",
  lede: "We’re enabling the future where an entire business can operate autonomously.",
};

export interface BuildStep {
  key: string;
  label: string;
  title: string;
  body: string;
}

const homeBaseBuildSteps: BuildStep[] = [
  { key: "learn", label: "Learn", title: "Learn the latent space", body: "Learns the latent space of an enterprise across core functions." },
  { key: "simulate", label: "Simulate", title: "Simulate cause and effect", body: "Simulates cause-and-effect relationships between functions." },
  { key: "plan", label: "Plan", title: "Plan over long horizons", body: "Plans over long horizons to accomplish highly complex tasks." },
  { key: "guardrails", label: "Guardrails", title: "Stay inside guardrails", body: "Subject to safety guardrails." },
];

export const homeBase = {
  mission: {
    label: "Mission",
    globeAlt:
      "A blue globe with eight stations on it, one for each enterprise function: customer support, product, design, engineering, marketing, sales, finance and operations. As the page scrolls the globe turns, the station facing the front is named, and work arcs from one station to the next.",
    before: "Our mission is to build the foundation infrastructure for autonomous enterprise through ",
    emphasis: "Engineering World Models.",
  },
  problem: {
    title: "The problem with next-token prediction",
    paragraphs: [
      "Enterprise work is long horizon, constrained and always evolving. A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.",
      "Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.",
      "Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.",
    ],
  },
  build: {
    title: "AI for the Engineered World",
    lead: "Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.",
    rest: "These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.",
    steps: homeBaseBuildSteps,
  },
  pareto: {
    title: "A new Pareto frontier",
    body: "By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.",
    axes: ["Cost", "Speed", "Quality"],
  },
  matters: {
    statement: { before: "With world models, AI systems can ", emphasis: "‘dream’", after: " what a successful business requires, and then execute it." },
    infrastructure: "We are building the foundation infrastructure for the software that powers enterprises.",
    body: "Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.",
    sectors: ["Industrial", "Healthcare", "Chemical", "Enterprise", "And beyond"],
    qualities: ["Long horizon planning", "Adaptability", "Reliability"],
  },
};

export const home = {
  ...homeBase,
  mission: {
    ...homeBase.mission,
    before: "Our mission is to create a future where businesses are run autonomously through ",
    emphasis: "Enterprise World Models.",
  },
  problem: {
    title: "The Problem with Next-Token Prediction",
    points: [
      { title: "Long Horizon Planning", body: "Planning and decision making in a business are long-horizoned, unconstrained and always evolving." },
      {
        title: "Dynamic Environment",
        body: "Business ecosystems constantly shift due to market volatility, competitor actions, and macroeconomic disruptions, requiring internal models that adapt continuously in real time.",
      },
      {
        title: "Inference efficiency",
        body: "Running high-frequency simulations, causal reasoning, and multi-agent operations at scale demands low-latency, cost-effective architectures to support autonomous business workflows.",
      },
    ],
    paragraphs: [
      "Autoregressive next-token prediction architectures don’t really work in a business since it is a living system of parts, processes and decisions that is only partially observable and constantly changing.",
      "Every single decision can ripple through thousands of downstream steps across multiple departments and processes.",
    ],
  },
  build: {
    ...homeBase.build,
    title: "Enterprise World Models",
    lead: "Skyfall AI has developed the first “Enterprise World Model” that learns the latent space of a business across its entirety: Design, Engineering, Sales, Marketing, Customer Support, Finance and Operations.",
    rest: "These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.",
    steps: [
      { key: "learn", label: "Learn", title: "Learn the latent space", body: "Learns the latent space of a business across its entirety." },
      ...homeBase.build.steps.slice(1),
    ],
  },
  pareto: {
    ...homeBase.pareto,
    body: "By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.",
  },
  matters: {
    title: "No more AI co-pilots",
    description: {
      before: "We are building foundation research for the software that will re-invent businesses. With world models, AI systems can ",
      emphasis: "‘dream’",
      after: " what a successful business requires, and then plan and execute its own actions.",
    },
    body: "Skyfall AI will advance AI research and develop AI systems for the business world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, manufacturing, enterprise, healthcare, sectors and beyond.",
    sectors: ["Industrial", "Manufacturing", "Enterprise", "Healthcare", "And beyond"],
    qualities: homeBase.matters.qualities,
  },
};

export interface Founder {
  name: string;
  role: string;
  note: string;
  photo: string;
}

export const teamBase = {
  title: "Founding Team",
  story:
    "Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.",
  founders: [
    { name: "Sam Pasupalak", role: "Co-founder · [Title]", note: "Co-founded Maluuba", photo: photos.sam },
    { name: "Kaheer Suleman", role: "Co-founder · [Title]", note: "Co-founded Maluuba", photo: photos.kaheer },
    { name: "Sumit Pasupalak", role: "Co-founder · [Title]", note: "Co-founded Ubiq (YC)", photo: photos.sumit },
  ] satisfies Founder[],
  experience:
    "Together, they bring more than 30 years of combined experience across business, product, and AI research, and they are now shaping the next era of AI.",
  researchTeam: "Skyfall AI has assembled a world class AI Research team of 25 engineers and researchers operating across three countries.",
  stats: [
    { value: "30+", label: "Years of combined experience" },
    { value: "25", label: "Engineers and researchers" },
    { value: "3", label: "Countries" },
  ],
  experienceFrom: ["Maluuba", "Microsoft", "University of Waterloo", "Y Combinator", "Mila", "Vector Institute"],
  careersCta: { label: "Careers", href: "#careers" },
};

export const team = {
  ...teamBase,
  story:
    "Founded by Maluuba co-founders, Skyfall AI is building foundational World Modeling technology that will transform how businesses operate. Maluuba was an early pioneer of the “Deep Learning” era which paved the path for the Transformers and LLMs breakthroughs. The Maluuba founders closely worked with Turing Award winners Yoshua Bengio and Richard Sutton. Microsoft acquired Maluuba and the team became Microsoft Research Canada.",
  experience:
    "Together, they bring more than 50 years of combined experience across fundamental science research and zero to one AI native product development as they are now shape the next era of AI.",
  researchTeam: "Skyfall AI has assembled a world class AI Research team of 25 engineers and researchers.",
  stats: [
    { value: "50+", label: "Years of combined experience" },
    { value: "25", label: "Engineers and researchers" },
  ],
  experienceLabel: "Our teams bring experience from",
  experienceFrom: ["Microsoft", "University of Toronto", "MILA", "Vector Institute", "AMII", "YCombinator"],
};

export interface Advisor {
  name: string;
  affiliations: string[];
  x: string;
}

export const backersBase = {
  title: "We're grateful for the support of our investors and advisors",
  investors: ["Fidelity", "Touring Capital", "M13", "Inovia Capital"],
  advisors: [
    { name: "François Chollet", affiliations: ["Google", "Keras", "NDEA"], x: "https://x.com/fchollet" },
    { name: "Naveen Rao", affiliations: ["Intel", "Databricks"], x: "https://x.com/NaveenGRao" },
  ] satisfies Advisor[],
};

export const backers = { ...backersBase, more: "And many others." };

export interface Stage {
  key: "explore" | "decompose" | "sketch" | "construct";
  label: string;
  title: string;
  body: string;
}

export const sky001Base = {
  nav: [
    { label: "Technical report", href: "#" },
    { label: "Blog", href: "https://temple-greene-saves-theorem.trycloudflare.com/" },
    { label: "Partnerships", href: "#" },
  ],
  news: {
    date: "October 19, 2026",
    label: "Skyfall News",
    title: "Skyfall AI announces SKY-001, a Latent World Model",
    cta: { label: "Read more", href: "https://temple-greene-saves-theorem.trycloudflare.com/" },
  },
  hero: {
    title: "First World Model for the Engineered World",
    lede: "Accelerating innovations in the physical economy with world models by building the foundation layer that powers enterprises.",
    note: "Our first stop is Design Engineering.",
  },
  intro: {
    before: "Introducing SKY-001, ",
    emphasis: "Intelligence for general engineering",
    statement: "The First World Model for the Engineered World; AI moving beyond language into latent space",
    waitlist: { title: "Get Early Access", body: "Join the waitlist now for early access.", cta: { label: "Join the waitlist", href: "#waitlist" } },
    video: { label: "Watch Launch Video", href: "#" },
  },
  contrarian: {
    title: "We’re taking a contrarian approach to research",
    points: [
      {
        title: "Not a plug-in",
        body: "Large language models excel at conversation, and a wave of wrappers now points them at every industry. But, engineering design isn’t a language problem. It’s a sequential decision problem that requires a model that can reason about geometry and truly understand the latent space.",
      },
      {
        title: "First Model that can Dream",
        body: "We built a new type of world model with a new architecture for the non-molithic era. SKY-001 is designed for the next generation of AI that can ‘dream’ anything in the physical world. We believe we cannot build something that we can’t dream about. SKY-001 is a general engineer that can dream from product concept to factory",
      },
      {
        title: "One Model, Many Domains",
        body: "As a latent world model, SKY-001 learns how physical systems are designed, built and run, in any domain. From engineering to operations, the possibilities are endless.",
      },
    ],
    figures: {
      input: "Input",
      picked: "Picked",
      mated: "Mated",
      constraints: ["Hole A ↔ Pin A", "Hole B ↔ Pin B", "Face ↔ Face"],
      dof: "DOF",
      constrained: "Fully constrained",
      alts: [
        "A bracket is reasoned onto a base in 3D: hole A slides over pin A along X then Y, the bracket turns about Z until hole B meets pin B, then drops face to face, its X, Y, Z and angle offsets counting to zero and its degrees of freedom from six to zero.",
        "One input sketch, with fourteen different 3D designs growing out of noise around it at the same moment; one is then picked.",
        "A turning globe with the domains SKY-001 is built for orbiting around it: PCB design, aerospace, energy, protein folding, molecules, computer use agents and enterprise software.",
      ],
    },
  },
  pareto: {
    title: "Designing a New Pareto Frontier with World Models",
    body: "We are pushing the boundaries of what’s possible in physical design with world modeling not just in one category but two.",
  },
  moment: {
    eyebrow: "Defining Moment in History",
    before: "Frontier Accuracy at ",
    emphasis: "1/150th",
    after: " the cost of LLMs",
    body: "Our world model beats LLMs because LLMs are autoregressive in nature and not designed for visual reasoning. Our approach is undoubtedly the best path for scale compared to LLMs and a game changer for the AI industry.",
    versus: "World Models vs. LLMs",
  },
  stages: {
    title: "How SKY-001 beats Prompt-Based Methods Step-By-Step",
    items: [
      {
        key: "explore",
        label: "Stage 1",
        title: "Parallel Explorations Through World Modeling",
        body: "Our model converts a 2D image or text prompt into several rough 3D assets at once. This lets you instantly explore different visual directions and pick the best foundation before diving into details.",
      },
      {
        key: "decompose",
        label: "Stage 2",
        title: "Recursive Diffusion-Based 3D Decomposition",
        body: "Once selected, it breaks down the high-level designs into smaller, individual parts, from large structural pieces all the way down to tiny screws and fasteners. By working layer by layer, our model keeps complex designs organized and easy to build, excelling in long horizon planning.",
      },
      {
        key: "sketch",
        label: "Stage 3",
        title: "Multi-step 2D to 3D Latent World Model",
        body: "It brings each part to life by recreating how a real designer works step-by-step. It starts by drawing precise 2D sketches stroke-by-stroke, then stretches, cuts, or shapes those sketches into finished 3D objects.",
      },
      {
        key: "construct",
        label: "Stage 4",
        title: "3D Construction World Model",
        body: "Finally, it assembles all the parts, layer by layer again, in hierarchical order into a complete 3D assembly that you can visualize immediately in standard 3D asset viewer",
      },
    ] satisfies Stage[],
  },
  why: {
    title: "Why do the World Models excel here?",
    items: [
      { title: "Cause & effect", note: "" },
      { title: "Physics", note: "understand geometry" },
      { title: "Latent space", note: "" },
      { title: "Long horizon planning", note: "hierarchical decomposition" },
    ],
  },
  next: {
    title: "Reinventing the physical economy with world models",
    body: "Today, SKY-001 is a hierarchical visual world model that plans and designs the assembly of engineered objects. Beyond manufacturing, SKY-001 is designed to become the underlying blueprint for complex physical design, spanning PCB design, Aerospace engineering, Energy and Power systems, Protein folding, Molecule design, Computer Use Agents, Enterprise Software and beyond.",
    domains: ["PCB design", "Aerospace engineering", "Energy and Power systems", "Protein folding", "Molecule design", "Computer Use Agents", "Enterprise Software"],
    closing: "Wherever structure, constraints, and sequence matter, SKY-001 plans and powers the build.",
  },
  team: {
    title: "The team behind SKY-001",
    groups: [
      { label: "Core contributors", names: "Haoye, Zichen, Mike (TBD)" },
      { label: "Full team", names: "Pavan et. al" },
      { label: "Leadership", names: "Sumit, Kaheer, Sam" },
    ],
  },
  faq: {
    title: "What you might be wondering",
    items: [
      {
        q: "What is SKY-001?",
        a: "SKY-001 is the first Engineering World Model that breaks a complex physical object into manageable parts and keeps them consistent across hundreds or thousands of construction steps. It enables you to visualize any physical object in the real-world just like a ‘General Engineer’.",
      },
      {
        q: "Is SKY-001 just another Language-based model?",
        a: "No, SKY-001 is World Model Based and doesn’t do next-token prediction like LLMs. Given a prompt or 2D image, it uses a hierarchical composer which decides what the design is made of, separates them hierarchically and it generates the whole design for you part-by-part.",
      },
      {
        q: "Why are World Models better for physical object design?",
        a: "LLMs are autoregressive and were not designed for visual reasoning. Engineering design, by contrast, is a complex process that requires a model to reason about geometry, form latent-space abstractions, and plan over long horizons, since most designs involve hundreds of thousands of steps which World Models are suitable for.",
      },
      { q: "How do I get access to SKY-001?", a: "Join the waitlist to be the first to hear when it goes public." },
      {
        q: "What is SKY-001 good at?",
        a: "SKY-001 excels at designing complex real-world objects with hundreds of thousands of parts, where getting the structure, constraints, and sequence right drives cost, speed, and design accuracy. It delivers frontier-level accuracy at 100 times the speed and 1/150th the cost of LLMs.",
      },
      {
        q: "What else can we design with SKY-001?",
        a: "We envision SKY-001 as the foundation model for designing any complex physical objects from PCBs, aerospace systems, and energy and power systems to proteins, molecules, computer-use agents, and much more.",
      },
      { q: "I have further questions. How to contact the team?", a: "Email us at info@skyfall.ai" },
    ],
  },
};

export const sky001 = {
  ...sky001Base,
  hero: {
    ...sky001Base.hero,
    title: "The First Engineering World Model",
    lede: "Accelerating innovations in the physical economy with world models",
    note: "Our first stop is Design & Engineering.",
  },
  intro: { ...sky001Base.intro, before: "INTRODUCING ", emphasis: "SKY-001" },
  contrarian: {
    ...sky001Base.contrarian,
    title: "We’re taking a contrarian approach to AI research",
    points: [
      {
        title: "Geometric & Spatial Reasoning",
        body: "Engineering design isn’t a language problem. It’s a sequential decision problem that requires a model that can reason about geometry and formulate latent space abstractions.",
      },
      {
        title: "First ‘Dreaming’ Foundational Model",
        body: "We built a new type of world model with a completely new architecture. SKY-001 is designed for the next generation of AI that can ‘dream’ anything in the physical world. SKY-001 is an AI general engineer that can dream from product concept to factory",
      },
      {
        title: "Generalization capabilities",
        body: "As a latent world model, SKY-001 fundamentally understands how physical systems are designed and manufactured. From engineering to operations, the possibilities are endless.",
      },
    ],
  },
  moment: {
    ...sky001Base.moment,
    body: "Our World Model significantly outperforms LLMs because LLMs are autoregressive in nature and not designed for Visual Reasoning. Our approach is the best path to scale compared to LLMs and a game changer for the AI industry.",
  },
};

export interface BenchmarkRow {
  model: string;
  ours: boolean;
  iou: number | null;
  seconds: number;
  cost: number;
}

export interface BenchmarkClaim {
  value: string;
  label: string;
  detail: string;
}

export interface BenchmarkView {
  label: string;
  clipLabel: string;
}

export interface BenchmarkModel {
  key: "cad" | "bim";
  tag: string;
  title: string;
  clip: string;
  clipLabel: string;
  compared: string;
  claims: BenchmarkClaim[];
  rows: BenchmarkRow[];
  views?: BenchmarkView[];
}

const resultsBaseModels: BenchmarkModel[] = [
  {
    key: "cad",
    tag: "3D CAD",
    title: "3D Construction World Model",
    clip: "3D CAD / same input, 4 models",
    clipLabel: "The same input image built into 3D CAD by SKY-001, GPT-6 Astra, Claude Opus 5.5 and Claude Fable 5.1",
    compared: "Compared to GPT-6 Astra",
    claims: [
      { value: "51×", label: "faster", detail: "3.9 s vs 199 s" },
      { value: "150×", label: "lower cost", detail: "$0.005 vs $0.75" },
      { value: "79.7%", label: "accuracy", detail: "IoU · LLMs best 79.1%" },
    ],
    rows: [
      { model: "SKY-001", ours: true, iou: 79.7, seconds: 3.9, cost: 0.005 },
      { model: "GPT-6 Astra", ours: false, iou: 79.1, seconds: 199, cost: 0.75 },
      { model: "Opus 5.5", ours: false, iou: 69.4, seconds: 110, cost: 0.31 },
      { model: "Gemini 3.8 Flash", ours: false, iou: 54.7, seconds: 112, cost: 0.08 },
      { model: "Qwen 3.8 Max", ours: false, iou: 34.4, seconds: 764, cost: 0.3 },
      { model: "Kimi K3", ours: false, iou: 9.5, seconds: 439, cost: 0.13 },
      { model: "Grok 4.7", ours: false, iou: null, seconds: 1250, cost: 0.59 },
    ],
  },
  {
    key: "bim",
    tag: "BIM",
    title: "BIM Construction World Model",
    clip: "BIM / 36 levels",
    clipLabel: "SKY-001 output: a 36-level tower built level by level",
    compared: "Compared to GPT-6 Astra",
    claims: [
      { value: "118×", label: "faster", detail: "1.22 s vs 144.4 s" },
      { value: "188×", label: "lower cost", detail: "$0.00237 vs $0.4465" },
      { value: "43.6%", label: "accuracy", detail: "IoU · LLMs best 42.3%" },
    ],
    rows: [
      { model: "SKY-001", ours: true, iou: 43.6, seconds: 1.22, cost: 0.00237 },
      { model: "GPT-6 Astra", ours: false, iou: 40.6, seconds: 144.4, cost: 0.4465 },
      { model: "Opus 5.5", ours: false, iou: 34.4, seconds: 113.1, cost: 0.276 },
      { model: "Gemini 3.8 Flash", ours: false, iou: 42.3, seconds: 345.4, cost: 0.2185 },
      { model: "Qwen 3.8 Max", ours: false, iou: 28.8, seconds: 254.5, cost: 0.111 },
      { model: "Kimi K3", ours: false, iou: 33.7, seconds: 114, cost: 0.27 },
      { model: "Grok 4.7", ours: false, iou: 28.2, seconds: 592.3, cost: 0.305 },
    ],
  },
];

export const resultsBase = {
  charts: {
    speed: { tab: "Speed", title: "Speed, samples per hour", note: "samples per hour = 3,600 ÷ seconds per sample" },
    cost: { tab: "Cost", title: "Cost, samples per $1", note: "samples per $1 = 1 ÷ cost per sample" },
    iou: { tab: "IoU", title: "Accuracy (IoU)", note: "IoU: overlap with the reference (%)" },
  },
  failed: "Failed",
  models: resultsBaseModels,
};

const renameOpus = (rows: BenchmarkRow[]): BenchmarkRow[] =>
  rows.map((row) => (row.model === "Opus 5.5" ? { ...row, model: "Claude Opus 5.5" } : row));

const [cadBase, bimBase] = resultsBaseModels;

export const results = {
  ...resultsBase,
  models: [
    {
      ...cadBase,
      rows: renameOpus(cadBase.rows),
      clip: "",
      views: [
        { label: "Accuracy", clipLabel: "SKY-001, GPT-6 Astra, Gemini 4 Argon and Claude Fable 5.1 building the same car, motorbike and engine parts from one input image" },
        { label: "Speed", clipLabel: "SKY-001, GPT-6 Astra, Claude Fable 5.1 and Gemini 4 building the same 3D CAD part, each with its running time" },
      ],
    },
    {
      ...bimBase,
      rows: renameOpus([
        { model: "SKY-001", ours: true, iou: 43.6, seconds: 1.22, cost: 0.0024 },
        { model: "GPT-6 Astra", ours: false, iou: 40.6, seconds: 144.6, cost: 0.446 },
        { model: "Opus 5.5", ours: false, iou: 34.4, seconds: 113.2, cost: 0.276 },
        { model: "Gemini 3.8 Flash", ours: false, iou: 42.3, seconds: 346.2, cost: 0.218 },
        { model: "Qwen 3.8 Max", ours: false, iou: 28.8, seconds: 255.3, cost: 0.111 },
        { model: "Kimi K3", ours: false, iou: 33.7, seconds: 113.9, cost: 0.27 },
        { model: "Grok 4.7", ours: false, iou: 28.2, seconds: 592.1, cost: 0.305 },
      ]),
      clip: "",
      clipLabel: "SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 drawing the same floor plan side by side",
      views: [
        { label: "Accuracy", clipLabel: "SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 drawing the same floor plan side by side" },
        { label: "Speed", clipLabel: "SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 timed on the same floor plan, until all four finish" },
      ],
      claims: [
        { value: "119×", label: "faster", detail: "1.22 s vs 144.6 s" },
        { value: "186×", label: "lower cost", detail: "$0.0024 vs $0.446" },
        bimBase.claims[2],
      ],
    },
  ] satisfies BenchmarkModel[],
};

export type ChartMetric = "iou" | "time" | "cost";

export const chartMeta = {
  charts: {
    iou: { tab: "IoU", title: "IoU", arrow: "↑", note: "Higher is better" },
    time: { tab: "Time", title: "Time / sample", arrow: "↓", note: "Lower is better" },
    cost: { tab: "Cost", title: "Cost / sample", arrow: "↓", note: "Lower is better" },
  } satisfies Record<ChartMetric, { tab: string; title: string; arrow: string; note: string }>,
  metrics: { cad: ["iou", "time", "cost"], bim: ["iou", "time", "cost"] } satisfies Record<"cad" | "bim", ChartMetric[]>,
  footnotes: { cad: { iou: "Grok 4.7 completed none" } } as Partial<Record<"cad" | "bim", Partial<Record<ChartMetric, string>>>>,
  titles: { bim: { time: "Time / plan", cost: "Cost / plan" } } as Partial<Record<"cad" | "bim", Partial<Record<ChartMetric, string>>>>,
  axes: {
    cad: { iou: [0, 50, 100], time: [0, 650, 1300], cost: [0, 0.4, 0.8] },
    bim: { iou: [0, 50, 100], time: [0, 300, 600], cost: [0, 0.25, 0.5] },
  } satisfies Record<"cad" | "bim", Record<ChartMetric, number[]>>,
  ticks: {
    cad: { iou: ["0%", "50%", "100%"], time: ["0s", "650s", "1300s"], cost: ["$0", "$0.4", "$0.8"] },
    bim: { iou: ["0%", "50%", "100%"], time: ["0s", "300s", "600s"], cost: ["$0", "$0.25", "$0.5"] },
  } satisfies Record<"cad" | "bim", Record<ChartMetric, string[]>>,
  labels: {
    cad: [
      ["79.7%", "3.9 s", "$0.005"],
      ["79.1%", "199 s", "$0.75"],
      ["69.4%", "110 s", "$0.31"],
      ["54.7%", "112 s", "$0.08"],
      ["34.4%", "764 s", "$0.30"],
      ["9.5%", "439 s", "$0.13"],
      ["–", "1,250 s", "$0.59"],
    ],
    bim: [
      ["43.6%", "1.22 s", "$0.0024"],
      ["40.6%", "144.6 s", "$0.446"],
      ["34.4%", "113.2 s", "$0.276"],
      ["42.3%", "346.2 s", "$0.218"],
      ["28.8%", "255.3 s", "$0.111"],
      ["33.7%", "113.9 s", "$0.270"],
      ["28.2%", "592.1 s", "$0.305"],
    ],
  } satisfies Record<"cad" | "bim", string[][]>,
};

export type ShowcaseId = "jaguar" | "jet" | "arcmate" | "tractor";

export const showcase = {
  title: "One image. Every part.",
  lede: "From a single picture to a complete 3D model, split into a tree of parts and refined down to the last bolt.",
  explore: {
    eyebrow: "Take it apart",
    title: "From Images to Design Processes.",
    body: "Every model on this page came out of the same automatic run.",
    cta: "Explore in 3D",
    viewer: { loading: "Loading 3D", close: "Close", previous: "Previous model", next: "Next model" },
  },
  disclaimer: "Final-shot finishes are materials transferred onto the predicted parts; they are not predicted by the model.",
  models: [
    { id: "jaguar", title: "Jaguar E-Type Roadster", kind: "Sports car", leaves: 103, nodes: 139, depth: 5 },
    { id: "jet", title: "Jet Engine", kind: "Turbofan", leaves: 70, nodes: 96, depth: 5 },
    { id: "arcmate", title: "FANUC ArcMate 100iB", kind: "Welding robot", leaves: 35, nodes: 55, depth: 4 },
    { id: "tractor", title: "Minitractor 4×4", kind: "Compact tractor", leaves: 92, nodes: 130, depth: 5 },
  ] satisfies { id: ShowcaseId; title: string; kind: string; leaves: number; nodes: number; depth: number }[],
};

export const partnership = {
  nav: "Partnership",
  title: "Partnership",
  fields: {
    name: { label: "Full name" },
    email: { label: "Work email" },
    website: { label: "Company website" },
    message: { label: "How can we help?", placeholder: "Write your query here...", maxWords: 250 },
  },
  submit: "Submit",
  sending: "Sending",
  required: "Required",
  errors: {
    required: "This field is required.",
    email: "Enter a valid email address, like name@company.com.",
    website: "Enter a valid website address, like company.com.",
    words: "Keep your message to 250 words or fewer.",
    failed: "Your query could not be sent. Check your connection and try again.",
  },
  success: { title: "Thank you", body: "We have received your query. Our team will reach out to you on the provided email.", close: "Close" },
};

export const waitlist = {
  title: "Join the waitlist",
  submit: "Submit",
  sending: "Sending",
  success: { title: "Thank you", body: "We have received your information and will mail you the necessary details.", close: "Close" },
};

export const blogCopy = {
  nav: "Blog",
  label: "Skyfall Blog",
  title: "Blog & Articles",
  lede: "Research, essays and notes from the team building world models for the enterprise.",
  featured: "Featured · Latest",
  readMore: "Read more",
  read: "Read",
  minRead: "min read",
  all: { title: "All articles", note: "Newest first" },
  reader: {
    back: "All articles",
    toc: "On this page",
    sections: "sections",
    share: "Share",
    copy: "Copy link",
    copied: "Copied",
    newer: "Newer",
    older: "Older",
    more: "Keep reading",
  },
  newsletter: {
    label: "Newsletter",
    title: "New research, straight to your inbox",
    body: "Every time we publish a paper, a benchmark or a note from building SKY-001, we'll send it to you. Nothing else.",
    email: "Work email",
    placeholder: "you@company.com",
    submit: "Subscribe",
    sending: "Sending",
    note: "One email per new article. Unsubscribe any time.",
    success: "You're subscribed. We'll email you when the next article goes live.",
  },
};

export const launchVideo = { title: "Launch video", note: "Placeholder clip. The launch video will appear here." };

export const routes = {
  sky001: "/sky-001",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  waitlist: "#join-waitlist",
  launchVideo: "#launch-video",
  partnership: "#partnership",
};
