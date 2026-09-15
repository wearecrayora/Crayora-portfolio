import type { Metadata } from "next";
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Crayora, creative tech studio" }],
  },
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
