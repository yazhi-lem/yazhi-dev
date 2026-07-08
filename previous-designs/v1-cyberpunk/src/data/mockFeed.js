export const MOCK_USERS = [
  {
    id: 'dravidians',
    name: 'Dravidians',
    handle: '@dravidians',
    role: 'Builder',
    city: 'Madurai',
    bio: 'Building native LLMs and shaping the Tamil AI ecosystem. Creator of Adhan & Project Sangam.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dravidians&backgroundColor=b6e3f4',
    reputation: 1542,
    github: 'dravidians'
  },
  {
    id: 'karthik_ux',
    name: 'Karthik S',
    handle: '@karthik_ux',
    role: 'Designer',
    city: 'Kochi',
    bio: 'Product Designer obsessed with brutalism and clean typography. Designing Illakiya IME.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karthik&backgroundColor=c0aede',
    reputation: 890,
    github: 'karthik-ux'
  },
  {
    id: 'anitha_rs',
    name: 'Anitha R.',
    handle: '@anitha_rs',
    role: 'Builder',
    city: 'Bangalore',
    bio: 'Security researcher and Rust developer. Core contributor to Yazhi Auth and Capitol.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anitha&backgroundColor=ffdfbf',
    reputation: 1205,
    github: 'anitha-rs'
  }
];

export const MOCK_FEED = [
  {
    id: 'post_1',
    authorId: 'dravidians',
    type: 'project_update',
    title: 'Adhan v2.0 - Tamil LLM Training Pipeline is now open source!',
    content: 'We just pushed the massive cleanup and reorganization of the Adhan repository. We bypassed GitHub branch protections using some git commit-tree wizardry to keep the history clean. Looking for contributors who want to help optimize our LoRA training scripts for consumer GPUs!',
    tags: ['AI', 'OpenSource', 'Tamil', 'Python'],
    likes: 128,
    comments: 34,
    timestamp: '2 hours ago',
    location: 'Madurai'
  },
  {
    id: 'post_2',
    authorId: 'karthik_ux',
    type: 'gig',
    title: 'Looking for a React Native dev for Illakiya v3',
    content: 'We are revamping the Illakiya IME interface. I have the Figma files ready (pure brutalist, highly accessible). Need a solid React Native engineer based in Kochi or willing to work async to bring these interactions to life.',
    tags: ['Gig', 'ReactNative', 'Mobile', 'UI/UX'],
    likes: 45,
    comments: 12,
    timestamp: '5 hours ago',
    location: 'Kochi'
  },
  {
    id: 'post_3',
    authorId: 'anitha_rs',
    type: 'milestone',
    title: 'Capitol backend just passed the Tier-1 Security Audit 🛡️',
    content: 'Massive shoutout to the Bangalore team. Our Actix-Web implementation for Capitol handled the penetration testing flawlessly. We are migrating the legacy Python/Flask fallback out by next week.',
    tags: ['Security', 'Rust', 'Backend'],
    likes: 210,
    comments: 18,
    timestamp: '1 day ago',
    location: 'Bangalore'
  },
  {
    id: 'post_4',
    authorId: 'dravidians',
    type: 'discussion',
    title: 'How should we structure cross-node collaboration?',
    content: 'With Madurai focusing on AI and Hyderabad on Infrastructure, how do we best manage data pipelines across these nodes? Should Project Sangam expose internal gRPC APIs for the AI team to consume directly?',
    tags: ['Architecture', 'Discussion', 'Infrastructure'],
    likes: 88,
    comments: 42,
    timestamp: '2 days ago',
    location: 'Madurai'
  }
];
