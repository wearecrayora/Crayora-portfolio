// Production domain. Override with NEXT_PUBLIC_SITE_URL (e.g. for a staging deploy).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crayoratech.com";

export const site = {
  name: "Crayora",
  legalName: "Crayora",
  tagline: "You dream it, we code it.",
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
    { label: "Instagram", href: "https://www.instagram.com/wearecrayora/" },
    { label: "Facebook", href: "https://www.facebook.com/people/Wearecrayora/61594198913749/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jyotiranjan-sahoo595" },
    { label: "GitHub", href: "https://github.com/wearecrayora" },
  ],
  instagram: "https://www.instagram.com/wearecrayora/",
  facebook: "https://www.facebook.com/people/Wearecrayora/61594198913749/",
} as const;

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/#studio" },
  { label: "Process", href: "/#process" },
] as const;
