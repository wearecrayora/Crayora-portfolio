import type { CountryCode } from "./countries";

export type ProjectType = "Website" | "E-commerce" | "Web platform";

export type Project = {
  slug: string;
  title: string;
  year: number;
  country: CountryCode;
  /** Human readable client location, e.g. "Tampa, Florida". */
  location: string;
  type: ProjectType;
  stack: string[];
  summary: string;
  about?: string;
  highlights: string[];
  liveUrl: string;
  image: { src: string; width: number; height: number };
  /** Pinned to the home page "Selected work" reel. */
  featured?: boolean;
};

const img = (slug: string, width: number, height: number) => ({
  src: `/work/${slug}.webp`,
  width,
  height,
});

// Newest first: this order drives the archive, the country lists and "next project" links.
export const projects: Project[] = [
  {
    slug: "samantroy-academy",
    title: "Samantroy Academy",
    year: 2026,
    country: "in",
    location: "Berhampur, Odisha",
    type: "Website",
    stack: ["Next.js", "React", "Tailwind CSS", "i18n", "Vercel"],
    summary:
      "A bilingual website for a Berhampur defence coaching academy running since 2001, built to turn aspirants into free counselling bookings.",
    about:
      "Samantroy Academy for Defence Career Studies has prepared students in Brahmapur (Berhampur), Ganjam for defence, police and government jobs since 2001. The site leads with proof: a rotating wall of selections by force and month, followed by guidance on every exam it coaches for, from Army, Navy and Air Force entries to Odisha Police, bank, railway and SSC. Eligibility, physical standards and the seven-stage recruitment process are explained in plain language, and every page points to one action, booking free counselling, with call and WhatsApp always in reach. The whole site switches between English and Odia for students across Odisha.",
    highlights: [
      "English and Odia versions of the site with a one-tap language switch in the header.",
      "A rotating wall of selections showing selected candidates by force and month.",
      "Exam, eligibility and physical-standards guides that lead into free counselling, calls and WhatsApp.",
    ],
    liveUrl: "https://www.samantroyacademy.com/",
    image: img("samantroy-academy", 1901, 887),
    featured: true,
  },
  {
    slug: "ssbwings",
    title: "SSBWINGS",
    year: 2026,
    country: "in",
    location: "Noida, Delhi NCR",
    type: "Website",
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase", "Razorpay", "Vercel"],
    summary:
      "A website for a Noida SSB interview academy mentored by retired SSB assessors, with online batch enrolment, free mock tests and a gallery of recommended candidates.",
    about:
      "SSBWINGS coaches defence aspirants for the five-day Services Selection Board interview from its campus in Sector 62, Noida, with mentors who are retired SSB assessors. The site explains the SSB process and every officer entry, from NDA and CDS to AFCAT, TES and Navy, and lets aspirants check their eligibility and try free OIR and SRT mock tests. Offline and online batches can be booked and paid for on the site, and a wall of honour puts real recommended candidates front and centre.",
    highlights: [
      "Course enrolment with Razorpay payments for offline and online batches.",
      "Free OIR and SRT mock tests, an eligibility finder and guides to every officer entry.",
      "A wall of honour and recommendation gallery built from real alumni results.",
    ],
    liveUrl: "https://www.ssbwings.com/",
    image: img("ssbwings", 1917, 912),
    featured: true,
  },
  {
    slug: "bcr-traders",
    title: "BCR Traders",
    year: 2026,
    country: "in",
    location: "Odisha, India",
    type: "E-commerce",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "i18n"],
    summary:
      "A wholesale grocery and spices store for a trusted B2B supplier. Customers check delivery by pincode, browse by category and order in bulk through a bilingual storefront.",
    about:
      "BCR Traders supplies packaged staples and branded masalas to retailers and households. The storefront pairs pincode-based delivery checks with a category-led catalog, product search, wishlist and cart, so bulk buyers can order in a few taps. A bilingual English and Odia interface with WhatsApp support keeps it accessible to local customers, while a promotional banner system highlights free delivery and seasonal offers.",
    highlights: [
      "Pincode-based delivery check that gates the shopping experience.",
      "Category-driven catalog with search, wishlist and a persistent cart.",
      "Bilingual English and Odia interface with WhatsApp support and promo banners.",
    ],
    liveUrl: "https://www.bcrtraders.com/",
    image: img("bcr-traders", 1896, 904),
  },
  {
    slug: "packmax-india",
    title: "Packmax India",
    year: 2026,
    country: "in",
    location: "India",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SEO"],
    summary:
      "A B2B packaging manufacturer, supplier and wholesaler site built around marketplace SEO and targeted keyword strategy. Currently in active development.",
    highlights: [
      "Dynamic marketplace SEO with targeted keyword strategy.",
      "B2B product catalog and supplier information showcase.",
      "Responsive layout tuned for business enquiries.",
    ],
    liveUrl: "https://www.packmaxindia.in/",
    image: img("packmax-india", 1907, 908),
  },
  {
    slug: "reveil-fragrance",
    title: "Reveil Fragrance",
    year: 2026,
    country: "in",
    location: "Berhampur, Odisha",
    type: "E-commerce",
    stack: ["Next.js", "Tailwind CSS", "Zustand", "Supabase", "Vercel", "PostHog"],
    summary:
      "A premium perfume brand store for a Berhampur-based client. Fully SEO optimised, with a modern architecture and product analytics built in.",
    highlights: [
      "SEO-first storefront with structured data and complete meta tags.",
      "Supabase backend with PostHog product analytics and event tracking.",
      "Zustand global state with a persistent cart and saved preferences.",
    ],
    liveUrl: "https://www.reveilfragrance.in/",
    image: img("reveil-fragrance", 1913, 912),
    featured: true,
  },
  {
    slug: "edusaarthi-india",
    title: "EduSaarthi India",
    year: 2026,
    country: "in",
    location: "India",
    type: "Web platform",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Razorpay", "Neon"],
    summary:
      "A scalable EdTech SaaS platform where creators upload, protect and monetise their learning content.",
    highlights: [
      "Role-based access control and secure content delivery through signed URLs.",
      "Hybrid cloud storage pipeline across AWS S3 and Google Drive.",
      "Subscription and transaction workflows powered by Razorpay.",
    ],
    liveUrl: "https://edusaarthi-iota.vercel.app/",
    image: img("edusaarthi-india", 1899, 908),
  },
  {
    slug: "peckers-chicken",
    title: "Peckers Chicken",
    year: 2026,
    country: "gb",
    location: "United Kingdom",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A restaurant site for Peckers Chicken, a UK poultry restaurant. Menu showcase, branch locations, online ordering and a rewards programme.",
    highlights: [
      "Menu showcase with rich food photography and online ordering.",
      "Branch finder plus a rewards and loyalty programme.",
      "Mobile app hooks, responsive layouts and customer reviews.",
    ],
    liveUrl: "https://www.peckerschicken.co.uk/",
    image: img("peckers-chicken", 1080, 608),
    featured: true,
  },
  {
    slug: "coasis",
    title: "Coasis",
    year: 2026,
    country: "us",
    location: "Tampa, Florida",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A restaurant and event venue site for Coasis in Tampa, built to sell the atmosphere, the menu, the entertainment and private events.",
    highlights: [
      "Menu and dining experience showcase.",
      "Event and private catering information with a visual gallery.",
      "Atmosphere-led art direction across every page.",
    ],
    liveUrl: "https://coasis.vercel.app/",
    image: img("coasis", 1902, 908),
    featured: true,
  },
  {
    slug: "vigro-it",
    title: "Vigro IT",
    year: 2026,
    country: "us",
    location: "United States",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A B2B site for an enterprise IT solutions provider covering infrastructure, security and cloud services for large companies.",
    highlights: [
      "Enterprise IT services and solutions showcase.",
      "Security infrastructure section with compliance certifications.",
      "Cloud services pages designed for enterprise buyers.",
    ],
    liveUrl: "https://vighro-it.vercel.app/",
    image: img("vigro-it", 1904, 912),
  },
  {
    slug: "hayat-interiors",
    title: "Hayat Interiors",
    year: 2025,
    country: "in",
    location: "Bengaluru, India",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A portfolio site for a luxury home interiors business in Bengaluru, showing projects, services and the design process through large, high-quality imagery.",
    highlights: [
      "Luxury project portfolio with filtering and full-bleed imagery.",
      "Design process timeline, service offerings and client testimonials.",
      "Enquiry management that works on every device.",
    ],
    liveUrl: "https://www.hayatinteriors.com/",
    image: img("hayat-interiors", 1901, 907),
  },
  {
    slug: "lemon-studio-dxb",
    title: "Lemon Studio",
    year: 2025,
    country: "ae",
    location: "Dubai, UAE",
    type: "Website",
    stack: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    summary:
      "A photography portfolio for a Dubai studio that puts the work first, with services, packages and a fast route to booking.",
    highlights: [
      "Gallery layouts with hover animation and lightbox previews.",
      "Smooth page transitions and a responsive contact form.",
      "Mobile-first presentation of services and packages.",
    ],
    liveUrl: "https://www.lemonstudiodxb.ae/",
    image: img("lemon-studio-dxb", 1897, 905),
    featured: true,
  },
  {
    slug: "vyra-herbals",
    title: "Vyra Herbals",
    year: 2025,
    country: "in",
    location: "India",
    type: "E-commerce",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "An online store for Vyra Herbals and its range of herbal hair oils and natural beauty products.",
    highlights: [
      "Product pages with benefits, ingredients and high-quality photography.",
      "Secure cart and checkout with customer reviews and ratings.",
      "Wellness blog, order tracking and customer support.",
    ],
    liveUrl: "https://www.vyraherbals.com/",
    image: img("vyra-herbals", 1903, 901),
  },
  {
    slug: "clienter",
    title: "Clienter",
    year: 2025,
    country: "global",
    location: "Worldwide",
    type: "Web platform",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase"],
    summary:
      "A client and project management platform for freelancers and agency owners. Clients, projects, teams and workflow in one place.",
    highlights: [
      "Client relationship tracking with project creation and assignment.",
      "Team management with role-based access and task tracking.",
      "Invoice and payment tracking with performance dashboards.",
    ],
    liveUrl: "https://clienter25.vercel.app/login",
    image: img("clienter", 1080, 608),
  },
  {
    slug: "homestead-community",
    title: "Homestead Community Associates",
    year: 2025,
    country: "us",
    location: "Georgia, USA",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A site for a Georgia property management and HOA services firm, built around a transparent, integrity-first approach to protecting property values.",
    highlights: [
      "HOA management services with clear service packages.",
      "Pricing information plus a homeowner portal and payments.",
      "Calm, trustworthy design for a trust-first service.",
    ],
    liveUrl: "https://homestead-green.vercel.app/",
    image: img("homestead-community", 1886, 905),
  },
  {
    slug: "orion-constructions",
    title: "Orion Constructions",
    year: 2024,
    country: "in",
    location: "India",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A site for a national general contractor with project showcases, services and region-specific information across India.",
    highlights: [
      "Project portfolio with case studies and regional offices.",
      "Service pages with construction image galleries.",
      "Enquiry forms built for mobile first.",
    ],
    liveUrl: "https://www.orionconstructions.co.in/",
    image: img("orion-constructions", 1909, 909),
  },
  {
    slug: "roxy-global",
    title: "Roxy Global",
    year: 2024,
    country: "ae",
    location: "United Arab Emirates",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A site for Roxy Global Food Products, importers, re-exporters and local suppliers of quality food across the globe.",
    highlights: [
      "Product catalog and service offerings.",
      "Global operations, supply chain and quality certifications.",
      "B2B-focused layout with business enquiry forms.",
    ],
    liveUrl: "https://roxyglobal.ae/",
    image: img("roxy-global", 1903, 912),
  },
  {
    slug: "job-launch-uk",
    title: "Job Launch UK",
    year: 2024,
    country: "gb",
    location: "United Kingdom",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A platform for international students building careers in the UK, with structured guidance, real access and honest support for placements.",
    highlights: [
      "Career guidance and programme listings for international students.",
      "Transparent pricing with real placement stories.",
      "Partner and employer network pages.",
    ],
    liveUrl: "https://www.joblaunchuk.co.uk/",
    image: img("job-launch-uk", 1080, 608),
  },
  {
    slug: "dealsofagro",
    title: "DealsOfAgro",
    year: 2024,
    country: "in",
    location: "Ganjam, Odisha",
    type: "Web platform",
    stack: ["Next.js", "React", "Firebase", "Figma"],
    summary:
      "An online marketplace for agricultural machinery. Sellers list equipment, and farmers browse, compare and buy with ease.",
    highlights: [
      "Listings and product pages backed by real-time Firebase data.",
      "Secure authentication and dynamic routing with Next.js.",
      "Farmer- and seller-friendly UI with admin tooling.",
    ],
    liveUrl: "https://dealsofagro.com/ganjam",
    image: img("dealsofagro", 1080, 608),
  },
  {
    slug: "accountrix-solutions",
    title: "Accountrix Solutions",
    year: 2024,
    country: "in",
    location: "India",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A site for a financial services firm delivering accounting and compliance for growing businesses, turning complexity into clarity.",
    highlights: [
      "End-to-end accounting and compliance services.",
      "Business solutions with client testimonials.",
      "Case studies presented with a trust-first design.",
    ],
    liveUrl: "https://www.accountrixsolutions.in/",
    image: img("accountrix-solutions", 1908, 909),
  },
  {
    slug: "u-rise",
    title: "U Rise",
    year: 2024,
    country: "global",
    location: "Worldwide",
    type: "Web platform",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A platform for discovering, launching and growing digital products, connecting makers with early adopters for validation and market entry.",
    highlights: [
      "Product discovery and showcase for new digital products.",
      "Community features for makers and early adopters.",
      "Launch tools and marketing support.",
    ],
    liveUrl: "https://u-rise-rosy.vercel.app/",
    image: img("u-rise", 1889, 907),
  },
  {
    slug: "renova-pharmaceuticals",
    title: "Renova Pharmaceuticals",
    year: 2023,
    country: "in",
    location: "India",
    type: "Website",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    summary:
      "A site for Renova Pharmaceuticals presenting its products, mission and commitment to quality in healthcare.",
    highlights: [
      "Product catalog and company mission.",
      "Research and development highlights plus careers.",
      "Trustworthy design with enquiry management.",
    ],
    liveUrl: "https://renovapharmaceuticals.com/",
    image: img("renova-pharmaceuticals", 1919, 911),
  },
  {
    slug: "coaching-shark",
    title: "Coaching Shark",
    year: 2023,
    country: "in",
    location: "India",
    type: "Web platform",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase"],
    summary:
      "A coaching and tuition management system for institutes: student performance, attendance, fee collection and daily operations.",
    highlights: [
      "Enrolment, attendance and performance tracking per student.",
      "Class scheduling and fee collection.",
      "Parent and admin reports with a real-time analytics dashboard.",
    ],
    liveUrl: "https://www.coachingshark.in/",
    image: img("coaching-shark", 1080, 608),
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const projectsByCountry = (code: CountryCode) => projects.filter((p) => p.country === code);

/** Order of the home page reel: spread across countries on purpose. */
const featuredOrder = [
  "samantroy-academy",
  "ssbwings",
  "lemon-studio-dxb",
  "peckers-chicken",
  "coasis",
  "reveil-fragrance",
];
export const featuredProjects = featuredOrder
  .map((slug) => projectBySlug(slug))
  .filter((p): p is Project => Boolean(p));

/** Headline numbers, derived from the project list so they never drift. */
const years = projects.map((p) => p.year);
export const stats = [
  { value: projects.length, suffix: "+", label: "Projects shipped" },
  {
    value: new Set(projects.filter((p) => p.country !== "global").map((p) => p.country)).size,
    suffix: "",
    label: "Countries served",
  },
  { value: new Set(projects.flatMap((p) => p.stack)).size, suffix: "+", label: "Technologies in production" },
  { value: Math.max(...years) - Math.min(...years) + 1, suffix: "", label: "Years of building" },
] as const;
