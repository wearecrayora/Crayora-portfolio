import { Plus } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "./json-ld";

/**
 * FAQ list on native <details> (keyboard accessible, fully crawlable, no JS)
 * with matching FAQPage structured data.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="border-t border-line-strong">
        {items.map((f) => (
          <details key={f.q} className="group border-b border-line-strong">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{f.q}</h3>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-transform duration-500 ease-[var(--ease-crayora)] group-open:rotate-45 group-open:border-indigo group-open:bg-indigo group-open:text-white">
                <Plus weight="bold" className="size-4" />
              </span>
            </summary>
            <p className="max-w-[68ch] pb-7 pr-16 text-lg leading-relaxed text-mute">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
