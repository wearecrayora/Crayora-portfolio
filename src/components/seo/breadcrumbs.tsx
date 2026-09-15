import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { TransitionLink } from "@/components/ui/transition-link";
import { JsonLd } from "./json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. The last item is the current page. */
export function Breadcrumbs({ items }: { items: [string, string][] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-mute">
          {items.map(([name, path], i) => {
            const last = i === items.length - 1;
            return (
              <li key={path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-paper">
                    {name}
                  </span>
                ) : (
                  <>
                    <TransitionLink href={path} className="transition-colors hover:text-paper">
                      {name}
                    </TransitionLink>
                    <CaretRight className="size-3 text-dim" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
