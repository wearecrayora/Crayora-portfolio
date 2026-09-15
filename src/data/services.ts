import type { ProjectType } from "./projects";

export type ServiceKey = "web" | "apps" | "social" | "software";

export type Service = {
  key: ServiceKey;
  /** URL segment under /services. Keyword-first for search. */
  slug: string;
  title: string;
  /** Full service name for the page H1 and structured data. */
  name: string;
  short: string;
  pitch: string;
  deliverables: string[];
  /** <title> and meta description for the service page. */
  seoTitle: string;
  metaDescription: string;
  intro: string;
  features: { title: string; body: string }[];
  /** Logo files in /public/stack. */
  tools: { name: string; file: string }[];
  faqs: { q: string; a: string }[];
  /** Case studies of these types are listed on the service page. */
  projectTypes?: ProjectType[];
};

export const services: Service[] = [
  {
    key: "web",
    slug: "website-development",
    title: "Website development",
    name: "Website development",
    short: "Websites",
    pitch:
      "Fast, search-ready websites and online stores that look like your brand and sell like your best salesperson.",
    deliverables: [
      "Brand and marketing sites",
      "E-commerce stores",
      "Landing pages",
      "CMS and blogs",
      "Technical SEO",
      "Speed and Core Web Vitals",
    ],
    seoTitle: "Website Development Company in India",
    metaDescription:
      "Custom, SEO-ready websites and e-commerce stores built with Next.js by Crayora, a web development company in India working with clients in the UAE, UK and USA.",
    intro:
      "We design and build websites that load fast, rank well and turn visitors into enquiries. Every site is custom designed, developed with Next.js and handed over with the SEO groundwork already done.",
    features: [
      {
        title: "Custom design, no templates",
        body: "Layouts and components designed around your brand and your customers, then built pixel for pixel.",
      },
      {
        title: "Built to rank",
        body: "Semantic markup, structured data, sitemaps, meta tags and Core Web Vitals tuned from day one.",
      },
      {
        title: "E-commerce that converts",
        body: "Catalogs, carts, secure payments, delivery checks and order flows for stores that sell online.",
      },
      {
        title: "Easy to keep fresh",
        body: "Content you can edit yourself, plus ongoing maintenance whenever you would rather not.",
      },
    ],
    tools: [
      { name: "Next.js", file: "nextdotjs" },
      { name: "React", file: "react" },
      { name: "TypeScript", file: "typescript" },
      { name: "Tailwind CSS", file: "tailwindcss" },
      { name: "Node.js", file: "nodedotjs" },
      { name: "PostgreSQL", file: "postgresql" },
      { name: "Figma", file: "figma" },
      { name: "Vercel", file: "vercel" },
    ],
    faqs: [
      {
        q: "How long does it take to build a website?",
        a: "A focused business website usually takes three to six weeks from kickoff to launch, and larger e-commerce builds take longer. You get a fixed timeline in the proposal before any work starts.",
      },
      {
        q: "Will my website be SEO friendly?",
        a: "Yes. Every site ships with clean semantic HTML, fast load times, meta tags, social share images, structured data, an XML sitemap and a robots file.",
      },
      {
        q: "Do you build e-commerce websites?",
        a: "Yes. We build online stores with product catalogs, carts, secure payment gateways such as Razorpay, order tracking and analytics.",
      },
      {
        q: "Can you redesign my existing website?",
        a: "Yes. We audit what you have, keep what already works for your search rankings and rebuild the rest with a modern design.",
      },
      {
        q: "Do you work with clients outside India?",
        a: "Yes. We work remotely with businesses in the UAE, the UK and the USA as well as across India.",
      },
    ],
    projectTypes: ["Website", "E-commerce"],
  },
  {
    key: "apps",
    slug: "android-ios-app-development",
    title: "Android & iOS apps",
    name: "Android & iOS app development",
    short: "Mobile apps",
    pitch:
      "One codebase, two stores. We design and ship cross-platform apps with the backend, payments and push notifications they need.",
    deliverables: [
      "Flutter and React Native apps",
      "UI and UX for mobile",
      "APIs and Firebase backends",
      "Payments and push notifications",
      "Play Store and App Store launch",
      "Updates and maintenance",
    ],
    seoTitle: "Android & iOS App Development Company",
    metaDescription:
      "Android and iOS app development by Crayora. Cross-platform Flutter and React Native apps with APIs, payments, push notifications and Play Store and App Store launch.",
    intro:
      "We design and develop mobile apps for Android and iOS from a single codebase, so you launch on both stores sooner and maintain one product instead of two.",
    features: [
      {
        title: "One codebase, both stores",
        body: "Flutter or React Native apps that look and feel native on Android phones and iPhones alike.",
      },
      {
        title: "Designed for thumbs",
        body: "Mobile-first UI and UX, prototyped in Figma and tested on real devices before a line of code ships.",
      },
      {
        title: "Backend included",
        body: "APIs, authentication, databases, payments and push notifications, built by the same team as the app.",
      },
      {
        title: "Launch and beyond",
        body: "Play Store and App Store submission, analytics, crash reporting and regular feature updates.",
      },
    ],
    tools: [
      { name: "Flutter", file: "flutter" },
      { name: "Dart", file: "dart" },
      { name: "React Native", file: "react" },
      { name: "Android", file: "android" },
      { name: "Android Studio", file: "androidstudio" },
      { name: "Firebase", file: "firebase" },
      { name: "Node.js", file: "nodedotjs" },
      { name: "Figma", file: "figma" },
    ],
    faqs: [
      {
        q: "Should I build a native or a cross-platform app?",
        a: "For most businesses a cross-platform app built with Flutter or React Native is the faster and more affordable choice. We recommend fully native development only when an app needs deep device features.",
      },
      {
        q: "Do you publish the app to the Play Store and App Store?",
        a: "Yes. We prepare the store listings, screenshots and release builds, and handle submission and review for both stores.",
      },
      {
        q: "Can you build the backend and admin panel too?",
        a: "Yes. We build the APIs, the database and an admin dashboard so your team can manage users, content and orders.",
      },
      {
        q: "How long does it take to build an app?",
        a: "A first version with the core features typically takes eight to twelve weeks, depending on scope. We agree the scope and timeline in writing before development starts.",
      },
      {
        q: "Do you maintain apps after launch?",
        a: "Yes. Maintenance covers operating system updates, bug fixes, performance monitoring and new features.",
      },
    ],
  },
  {
    key: "social",
    slug: "social-media-marketing",
    title: "Social media marketing",
    name: "Social media marketing",
    short: "Social media",
    pitch:
      "We plan it, shoot it, post it and look after the account, so your feed keeps working while you run the business.",
    deliverables: [
      "Content strategy and calendars",
      "Photo and video shoots",
      "Reels and short-form editing",
      "Scheduling and posting",
      "Account handling and replies",
      "Monthly performance reports",
    ],
    seoTitle: "Social Media Marketing Agency in India",
    metaDescription:
      "Social media marketing by Crayora: content strategy, photo and video shoots, reels, posting and full account handling for Instagram, Facebook, YouTube and LinkedIn.",
    intro:
      "We run your social media end to end. Strategy, shoot days, editing, captions, scheduling, replies and reporting, handled by one team so your brand shows up consistently every week.",
    features: [
      {
        title: "Strategy first",
        body: "Audience research, content pillars and a monthly calendar built around your business goals.",
      },
      {
        title: "Shoots and production",
        body: "Photo and video shoots, reels and short-form edits made for the way each platform is watched.",
      },
      {
        title: "Posting and account handling",
        body: "Scheduling, captions, hashtags, comments and DMs taken care of every day.",
      },
      {
        title: "Reports that make sense",
        body: "Monthly reports on reach, engagement and enquiries, with a clear plan for what changes next.",
      },
    ],
    tools: [
      { name: "Figma", file: "figma" },
      { name: "Instagram", file: "instagram" },
      { name: "Facebook", file: "facebook" },
      { name: "YouTube", file: "youtube" },
      { name: "LinkedIn", file: "linkedin" },
      { name: "X", file: "x" },
    ],
    faqs: [
      {
        q: "Which social media platforms do you manage?",
        a: "Instagram, Facebook, YouTube, LinkedIn and X. We recommend focusing on the platforms where your customers actually spend their time.",
      },
      {
        q: "Do you shoot the photos and videos?",
        a: "Yes. We plan shoot days, capture the photo and video content, and edit it into posts, reels and stories.",
      },
      {
        q: "How often will you post?",
        a: "Posting frequency is agreed in your monthly plan and depends on the platforms and the package you choose.",
      },
      {
        q: "Do you reply to comments and messages?",
        a: "Yes. Account handling includes community management: replying to comments and messages and passing new leads to your team.",
      },
      {
        q: "How do you measure results?",
        a: "Every month you get a report covering reach, engagement, follower growth and enquiries, together with next month's plan.",
      },
    ],
  },
  {
    key: "software",
    slug: "custom-software-development",
    title: "Custom software",
    name: "Custom software development",
    short: "Custom software",
    pitch:
      "Dashboards, SaaS platforms and internal tools shaped around how your team actually works, not the other way round.",
    deliverables: [
      "SaaS platforms",
      "CRMs and admin dashboards",
      "Marketplaces",
      "Role-based access and auth",
      "Payment gateways",
      "Cloud storage and integrations",
    ],
    seoTitle: "Custom Software Development Company in India",
    metaDescription:
      "Custom software development by Crayora: SaaS platforms, CRMs, dashboards and marketplaces with role-based access, payments and cloud integrations.",
    intro:
      "When off-the-shelf tools don't fit, we build software that does. SaaS products, internal dashboards, CRMs and marketplaces designed around your workflow and built to scale with you.",
    features: [
      {
        title: "Built around your workflow",
        body: "We map how your team works first, then design software that removes the busywork.",
      },
      {
        title: "Secure by design",
        body: "Role-based access control, proper authentication and signed URLs for protected content.",
      },
      {
        title: "Payments and integrations",
        body: "Subscriptions through Razorpay, cloud storage on AWS S3 and Google Drive, and the APIs you already rely on.",
      },
      {
        title: "Ready to scale",
        body: "TypeScript, PostgreSQL and Prisma on modern cloud hosting, with analytics dashboards built in.",
      },
    ],
    tools: [
      { name: "Next.js", file: "nextdotjs" },
      { name: "TypeScript", file: "typescript" },
      { name: "Node.js", file: "nodedotjs" },
      { name: "PostgreSQL", file: "postgresql" },
      { name: "Prisma", file: "prisma" },
      { name: "MongoDB", file: "mongodb" },
      { name: "Firebase", file: "firebase" },
      { name: "Docker", file: "docker" },
    ],
    faqs: [
      {
        q: "What kind of custom software do you build?",
        a: "SaaS platforms, CRMs, admin dashboards, marketplaces, booking and management systems, and internal tools for teams.",
      },
      {
        q: "Can you build a SaaS product from scratch?",
        a: "Yes. We take SaaS products from idea to launch: product design, architecture, subscriptions and billing, and the admin tools to run it.",
      },
      {
        q: "Can you integrate with the tools we already use?",
        a: "Yes. We integrate payment gateways, cloud storage, email, analytics and third-party APIs.",
      },
      {
        q: "How do you keep the project on track?",
        a: "We work in short cycles on a live staging link, so you can review real progress every week.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. Maintenance plans cover hosting, monitoring, security updates and new features.",
      },
    ],
    projectTypes: ["Web platform"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceByKey = (key: ServiceKey) => services.find((s) => s.key === key)!;

export const process = [
  {
    title: "Discover",
    body: "A call, a questionnaire and a look at your competitors. We leave with goals, scope and a fixed plan.",
    output: "Scope and timeline",
  },
  {
    title: "Design",
    body: "Wireframes first, then high-fidelity screens in your brand. You review real layouts, not mood boards.",
    output: "Figma prototype",
  },
  {
    title: "Build",
    body: "We develop in short cycles on a live staging link, so you can click through progress every week.",
    output: "Staging link",
  },
  {
    title: "Launch and grow",
    body: "Deployment, analytics, SEO and handover. Then content, campaigns and updates to keep it moving.",
    output: "Live product",
  },
] as const;

export const stackLogos = [
  { name: "Next.js", file: "nextdotjs" },
  { name: "React", file: "react" },
  { name: "TypeScript", file: "typescript" },
  { name: "Node.js", file: "nodedotjs" },
  { name: "Tailwind CSS", file: "tailwindcss" },
  { name: "Three.js", file: "threedotjs" },
  { name: "Flutter", file: "flutter" },
  { name: "Dart", file: "dart" },
  { name: "Android", file: "android" },
  { name: "Firebase", file: "firebase" },
  { name: "PostgreSQL", file: "postgresql" },
  { name: "MongoDB", file: "mongodb" },
  { name: "Prisma", file: "prisma" },
  { name: "Docker", file: "docker" },
  { name: "Figma", file: "figma" },
  { name: "Vercel", file: "vercel" },
] as const;
