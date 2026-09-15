import { renderOg } from "@/lib/og";
import { serviceBySlug, services } from "@/data/services";

export const alt = "Crayora service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug) ?? services[0];
  return renderOg({ eyebrow: "Service", title: service.name, subtitle: service.pitch });
}
