import { renderOg } from "@/lib/og";
import { projects } from "@/data/projects";

export const alt = "Crayora client work across India, the UAE, the UK and the USA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Our work",
    title: `${projects.length} projects, 4 countries.`,
    subtitle: "Case studies from India, the UAE, the UK and the USA, each with a link to the live site.",
  });
}
