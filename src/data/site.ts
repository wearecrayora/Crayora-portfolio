const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site = {
  name: "Crayora",
  legalName: "Crayora",
  tagline: "We colour outside the lines.",
  description:
    "Crayora is a web, app and social media studio in Odisha, India. We build websites, Android and iOS apps and custom software, and run social media for brands.",
  url: siteUrl.replace(/\/$/, ""),
  email: "crayoratech@gmail.com",
  phone: "+91 81143 25023",
  phoneHref: "tel:+918114325023",
  whatsapp: "https://wa.me/918114325023",
  location: {
    city: "Brahmapur",
    region: "Odisha",
    country: "India",
    countryCode: "IN",
    geo: { lat: 19.3149, lng: 84.7941 },
  },
  founder: {
    name: "Jyotiranjan Sahoo",
    role: "Founder",
    linkedin: "https://www.linkedin.com/in/jyotiranjan-sahoo595",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/jyotiranjan_x04/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jyotiranjan-sahoo595" },
    { label: "GitHub", href: "https://github.com/wearecrayora" },
  ],
} as const;

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/#studio" },
  { label: "Process", href: "/#process" },
] as const;
