import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { RouteTransitionProvider } from "@/components/providers/route-transition";
import { Preloader } from "@/components/preloader";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BoneyardSetup } from "@/components/providers/boneyard-setup";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { absoluteUrl, organizationId } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Crayora | Website, App & Social Media Agency in India",
    template: "%s | Crayora",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  keywords: [
    "website development company in India",
    "web design agency Odisha",
    "Android app development company",
    "iOS app development",
    "social media marketing agency",
    "content creation and video shoots",
    "custom software development",
    "Next.js development agency",
    "web developer Brahmapur",
    "e-commerce website development",
  ],
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Crayora | Website, App & Social Media Agency in India",
    description: site.description,
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Crayora, creative tech studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crayora | Website, App & Social Media Agency in India",
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#070b1a",
  colorScheme: "dark",
};

// Site-wide entities. Pages reference the organisation by @id instead of repeating it.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": organizationId,
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/crayora-logo.png"), width: 512, height: 512 },
      image: absoluteUrl("/og.png"),
      email: site.email,
      telephone: site.phone.replace(/\s/g, ""),
      description: site.description,
      slogan: site.tagline,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressRegion: site.location.region,
        addressCountry: site.location.countryCode,
      },
      geo: { "@type": "GeoCoordinates", latitude: site.location.geo.lat, longitude: site.location.geo.lng },
      areaServed: ["India", "United Arab Emirates", "United Kingdom", "United States"].map((name) => ({ "@type": "Country", name })),
      founder: { "@type": "Person", name: site.founder.name, sameAs: [site.founder.linkedin] },
      sameAs: site.socials.map((s) => s.href),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        telephone: site.phone.replace(/\s/g, ""),
        availableLanguage: ["English"],
      },
      knowsAbout: services.map((s) => s.name),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/services/${s.slug}`) },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": organizationId },
      inLanguage: "en-IN",
    },
  ],
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`dark ${syne.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <JsonLd data={jsonLd} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-paper px-5 py-3 font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <BoneyardSetup />
        <SmoothScroll>
          <RouteTransitionProvider>
            <Preloader />
            <SiteHeader />
            <main id="main" className="relative z-[1] bg-ink">
              {children}
            </main>
            <SiteFooter />
          </RouteTransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
