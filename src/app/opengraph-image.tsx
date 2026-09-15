import { renderOg } from "@/lib/og";

export const alt = "Crayora: websites, Android and iOS apps, custom software and social media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Web, app and social studio",
    title: "We colour outside the lines.",
    subtitle: "Websites, mobile apps, custom software and social media for brands in India, the UAE, the UK and the USA.",
  });
}
