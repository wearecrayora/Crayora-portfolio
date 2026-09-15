import type { Metadata } from "next";
import { logoShareImage } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Studio } from "@/components/home/studio";
import { ServicesStack } from "@/components/home/services-stack";
import { FeaturedWork } from "@/components/home/featured-work";
import { WorldWork } from "@/components/home/world-work";
import { Process } from "@/components/home/process";
import { CtaBlock } from "@/components/home/cta-block";

const homeTitle = "Crayora | Website, App & Social Media Agency in India";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Crayora",
    locale: "en_IN",
    title: homeTitle,
    images: [logoShareImage],
  },
  twitter: { card: "summary_large_image", title: homeTitle, images: [logoShareImage.url] },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Studio />
      <ServicesStack />
      <FeaturedWork />
      <WorldWork />
      <Process />
      <CtaBlock />
    </>
  );
}
