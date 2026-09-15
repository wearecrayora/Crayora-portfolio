import { renderOg } from "@/lib/og";

export const alt = "Crayora services: websites, mobile apps, social media and custom software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Services",
    title: "Four disciplines. One team.",
    subtitle: "Website development, Android and iOS apps, social media marketing and custom software.",
  });
}
