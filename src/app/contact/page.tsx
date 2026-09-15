import { ArrowUpRight, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { absoluteUrl, organizationId, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata({
  title: "Contact Crayora: Start a Project",
  description:
    "Start a website, app, software or social media project with Crayora. Email crayoratech@gmail.com or call +91 81143 25023. We reply within one working day.",
  path: "/contact",
});

const channels = [
  { icon: EnvelopeSimple, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, href: site.phoneHref },
  { icon: WhatsappLogo, label: "WhatsApp", value: "Message us", href: site.whatsapp, external: true },
  {
    icon: MapPin,
    label: "Studio",
    value: `${site.location.city}, ${site.location.region}, ${site.location.country}`,
  },
];

const nextSteps = [
  "We read your message and reply within one working day.",
  "A 30-minute call to understand goals, scope and budget.",
  "A written proposal with a fixed timeline and price.",
];

export default function ContactPage() {
  return (
    <div className="shell pb-32 pt-32 md:pb-44 md:pt-40">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Crayora",
          url: absoluteUrl("/contact"),
          about: { "@id": organizationId },
        }}
      />
      <Breadcrumbs items={[["Home", "/"], ["Contact", "/contact"]]} />
      <SplitReveal as="h1" by="chars" onIntro delay={0.3} className="display-xl mt-8 max-w-[12ch]">
        Start a <span className="text-outline">project.</span>
      </SplitReveal>

      <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-12">
        <aside className="flex flex-col gap-12 lg:col-span-4">
          <ul className="flex flex-col gap-6">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-indigo-hi">
                  <Icon weight="duotone" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-mute">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-underline inline-flex items-center gap-1 break-all text-paper"
                    >
                      {value}
                      {external && <ArrowUpRight className="size-3.5" />}
                    </a>
                  ) : (
                    <p className="text-paper">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-[var(--radius-panel)] border border-line bg-navy-2 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">What happens next</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-indigo font-mono text-xs text-white">
                    {i + 1}
                  </span>
                  <p className="text-mute">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
