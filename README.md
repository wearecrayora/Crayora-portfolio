# Crayora

Company website for Crayora (crayoratech.com), a creative tech studio offering website development, Android and iOS apps, social media marketing and custom software.

Built with Next.js 16 (App Router, fully static pages), Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, DrawSVG, ScrambleText, Flip), Lenis smooth scrolling, Three.js via React Three Fiber, cobe for the globe, and boneyard-js for skeleton loading. Contact enquiries are delivered with Resend.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm run bones` | Re-captures skeleton layouts from the running dev server (see below) |
| `npm run brand` | Regenerates the favicon and Apple icon from `public/brand` |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Send-only Resend API key for the contact form |
| `RESEND_FROM` | After domain verification | Sender, e.g. `Crayora <hello@crayoratech.com>` |
| `CONTACT_TO` | No | Comma-separated inboxes for enquiries (defaults to the two studio addresses) |
| `NEXT_PUBLIC_SITE_URL` | No | Overrides the default `https://crayoratech.com`, e.g. for staging |

Keep secrets in `.env.local` locally and in your host's environment settings in production. `.env*` files are gitignored.

## Editing content

All copy and data lives in `src/data`:

- `site.ts`: company name, domain, email, phone, WhatsApp, address, Instagram, Facebook and other socials, founder.
- `projects.ts`: every case study. Each project has a `country` code, which drives the country grouping on the home page globe, the `/work` filters and the "More from…" links. Set `featured: true` and add the slug to `featuredOrder` to put a project in the home page reel.
- `countries.ts`: country names, blurbs, where the globe faces, and client city markers.
- `services.ts`: the four services (including the SEO title, meta description, features, tools and FAQs for each `/services/<slug>` page), the process steps and the tech logo wall.

Project screenshots live in `public/work/<slug>.webp`. For a new project, also add a JPEG copy (1100px wide) to `src/assets/og/work/<slug>.jpg`; it is used in that project's share image.

## Contact form

`/api/contact` validates the enquiry and sends one email per inbox in `CONTACT_TO` through Resend, with the enquirer as reply-to.

Until a sending domain is verified, Resend only delivers to the account owner (crayoratech@gmail.com). To deliver to every inbox:

1. Add `crayoratech.com` at [resend.com/domains](https://resend.com/domains) and create the DNS records it shows.
2. Once it is verified, set `RESEND_FROM=Crayora <hello@crayoratech.com>`.

## SEO and link sharing

The site URL defaults to `https://crayoratech.com` and is used for canonical URLs, Open Graph URLs, the sitemap and structured data.

- Every page is statically generated and has a unique title, meta description, canonical URL, Open Graph and Twitter card (`src/lib/seo.ts`).
- Share images: each route has an `opengraph-image.tsx` rendered at build time by `src/lib/og.tsx` (1200×630, brand aurora, glass panel). Case studies show the project screenshot in a browser frame. Fonts for these images are in `src/assets/og/fonts`.
- Structured data: Organization and WebSite site-wide, plus Service and FAQPage on service pages, CreativeWork on case studies, CollectionPage on `/work`, ContactPage on `/contact` and BreadcrumbList with visible breadcrumbs.
- `/sitemap.xml` (with case study images), `/robots.txt` and `/manifest.webmanifest` are generated from the data files, so new projects and services are picked up automatically.
- The `/work` archive is fully server-rendered so crawlers see every case study link.

## Responsive behaviour

One set of HTML is served to every device (best for SEO and caching); layouts and animations adapt with CSS breakpoints and `gsap.matchMedia`.

- Large screens (1024px and up): pinned service stack, curtain footer, side-by-side hero, globe beside the project list.
- Phones and tablets: stacked layouts; service cards unfold as they scroll in; the work reel still pans with scroll and snaps to cards on phones; the process line runs down the side; normal footer.
- Floating widgets on every page: contact dock (WhatsApp, Instagram, Facebook, email) and a scroll-progress back-to-top ring. The hero has floating stat cards.

## Skeleton loading (boneyard)

Project cards and the case study cover use `<Skeleton>` from boneyard-js. The skeleton shapes in `src/bones` are snapshotted from the real rendered DOM. After changing those layouts, re-capture them with the dev server running:

```bash
npx playwright install chromium   # once
npm run dev
npx boneyard-js build http://localhost:3000/work --force
npx boneyard-js build http://localhost:3000/work/hayat-interiors
```

## Brand assets

`public/brand` holds SVG versions of the logo traced from the PNGs in `/logo`. `src/lib/logo-paths.ts` contains the same paths for the header, preloader, footer wordmark and the 3D hero mark.

## Motion and accessibility

Every animation checks `prefers-reduced-motion`: smooth scrolling, pinning, the 3D scene's movement, the aurora, marquee and reveals switch off or become instant. Glass panels fall back to solid surfaces under `prefers-reduced-transparency`. The 3D hero and the globe stop rendering when off screen.
