import { renderOg } from "@/lib/og";
import { site } from "@/data/site";

export const alt = "Start a project with Crayora";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Start a project.",
    subtitle: `${site.email}  /  ${site.phone}. We reply within one working day.`,
  });
}
