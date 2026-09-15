# Crayora

Company website for Crayora, a creative tech studio offering website development, Android and iOS apps, social media marketing and custom software.

Built with Next.js 16 (App Router, fully static pages), Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, DrawSVG, ScrambleText, Flip), Lenis smooth scrolling, Three.js via React Three Fiber, cobe for the globe, and boneyard-js for skeleton loading.

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
| `npm run brand` | Regenerates favicon, Apple icon and the default Open Graph image (`public/og.png`) from `public/brand` |

## Editing content

All copy and data lives in `src/data`:

- `site.ts`: company name, email, phone, WhatsApp, address, socials, founder.
- `projects.ts`: every case study. Each project has a `country` code, which drives the country grouping on the home page globe, the `/work` filters and the "More from…" links. Set `featured: true` and add the slug to `featuredOrder` to put a project in the home page reel.
- `countries.ts`: country names, blurbs, where the globe faces, and client city markers.
- `services.ts`: the four services (including the SEO title, meta description, features, tools and FAQs for each `/services/<slug>` page), the process steps and the tech logo wall.

Project screenshots live in `public/work/<slug>.webp` (resized copies of the images from the personal portfolio).

## SEO

Set `NEXT_PUBLIC_SITE_URL` to the live domain in production (on Vercel it falls back to the production URL). It is used for canonical URLs, Open Graph URLs, the sitemap and structured data.

- Every page is statically generated and has a unique title, meta description, canonical URL, Open Graph and Twitter card (`src/lib/seo.ts`). Case studies use their own screenshot as the share image.
- Structured data: Organization and WebSite site-wide, plus Service and FAQPage on service pages, CreativeWork on case studies, CollectionPage on `/work`, ContactPage on `/contact` and BreadcrumbList with visible breadcrumbs.
- `/sitemap.xml` (with case study images), `/robots.txt` and `/manifest.webmanifest` are generated from the data files, so new projects and services are picked up automatically.
- The `/work` archive is fully server-rendered so crawlers see every case study link.

## Contact form

`/api/contact` sends enquiries with Nodemailer. Set `EMAIL_USER` and `EMAIL_PASS` (a Gmail app password) and optionally `CONTACT_TO`. Until they are set, the form shows a friendly error with the email address as a fallback.

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

Every animation checks `prefers-reduced-motion`: smooth scrolling, pinning, the 3D scene's movement, marquee and reveals switch off or become instant. The 3D hero and the globe stop rendering when off screen.
