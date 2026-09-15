import type { Metadata } from "next";
import { site } from "@/data/site";

type PageMeta = {
  /** Page title without the brand suffix (the root layout template adds " | Crayora"). */
  title: string;
  description: string;
  /** Route path, e.g. "/work". Used for the canonical URL and og:url. */
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article";
};

const defaultImage = { url: "/og.png", width: 1200, height: 630, alt: "Crayora, creative tech studio" };

/**
 * Consistent per-page metadata: canonical URL, Open Graph and Twitter cards.
 * Child segments replace the parent's openGraph object wholesale, so every page
 * sets its own complete set here rather than relying on inheritance.
 */
export function pageMetadata({ title, description, path, image = defaultImage, type = "website" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      title: `${title} | ${site.name}`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image.url],
    },
  };
}

export const absoluteUrl = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

/** schema.org BreadcrumbList from ordered [name, path] pairs. */
export function breadcrumbJsonLd(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export const organizationId = `${site.url}/#organization`;
