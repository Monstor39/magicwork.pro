# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`). Do not switch to npm/yarn.

- `pnpm dev` — Next.js dev server on http://localhost:3000
- `pnpm build` — static export → `out/` (the deployable artifact)
- `pnpm lint` — ESLint (flat config, `eslint.config.mjs`)

There is no `pnpm start` — the site is static (`output: "export"`), deployed to GitHub Pages.

There is no test runner configured. There is no typecheck script — run `pnpm exec tsc --noEmit` if you need one.

`pnpm lint` currently reports two **pre-existing** errors in `components/hero/HeroBackdrop.tsx` and `components/sections/CaseStudy.tsx` (`react-hooks/set-state-in-effect`). They predate any current task — don't be confused by them when validating your own changes. Lint your own files specifically: `pnpm exec eslint <paths>`.

## Architecture

Single-page marketing site for **MagicWork** — a localized landing assembled from section components. **Statically exported** and deployed to **GitHub Pages** at `magicwork.pro`. There is no server runtime: leads are sent directly from the browser to the Telegram Bot API. Stack: **Next.js 16.2.6 App Router (static export) + React 19.2.4 + Tailwind CSS v4 + next-intl**.

### Things that diverge from defaults

- **Static export only.** `next.config.ts` sets `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`. Build emits `out/`, which is uploaded to GH Pages by `.github/workflows/deploy.yml`. No middleware, no API routes, no dynamic SSR — anything that requires Node at request time will break the build.
- **No middleware.** There is no `proxy.ts` / `middleware.ts` (middleware can't run on GH Pages). Locale routing is handled purely by `app/[locale]/...` + `generateStaticParams`. Root `/` is served by `public/index.html`, which redirects to `/ru/` (or `/en/` based on `navigator.language`).
- **Tailwind v4 — no `tailwind.config.{js,ts}`.** Theme tokens (`--color-bg`, `--color-accent`, `--font-display`, etc.) are declared in `app/globals.css` inside `@theme { ... }`. Add new design tokens there, not in a config file.
- **Path alias:** `@/*` → project root (`tsconfig.json`).
- **Async `params`:** pages destructure `params` as a `Promise` (e.g. `params: Promise<{ locale: string }>`). Always `await` it. This is the current Next conventions — do not "fix" it.
- **`setRequestLocale(locale)`** must be called at the top of every locale-scoped server component (page + layout) to enable static rendering with next-intl.
- **`force-static` on metadata routes.** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` all export `const dynamic = "force-static"` — required for `output: "export"`.

### Routing & i18n

- Locales: `ru` (default), `en`. Configured in `i18n/routing.ts` with `localePrefix: "always"` — RU is at `/ru/`, EN is at `/en/`. Bare `/` is a static redirect from `public/index.html`. (We can't use `as-needed` because there's no middleware to do the locale-detection redirect.)
- `i18n/request.ts` wires per-request messages from `messages/{locale}.json`.
- `i18n/navigation.ts` exports locale-aware `Link`, `redirect`, `useRouter`, etc. — **import navigation from `@/i18n/navigation`, not from `next/link` / `next/navigation`** for any user-facing in-app links.
- `next.config.ts` wraps the config with `createNextIntlPlugin("./i18n/request.ts")`.
- All UI strings live in `messages/ru.json` and `messages/en.json` — keep keys in sync between locales.
- **i18n key conventions:** namespace name = section name (e.g. `useTranslations("aiLeaders")`). For array fields (companies, FAQ items, principles, niches), use `t.raw("companies") as Company[]` and type the shape locally — there's no shared schema file. Both locale files MUST contain the same keys; a missing key surfaces as `MISSING_MESSAGE` in dev. When you add a new section, also add its short label to the `nav` namespace in both files.

### Page composition

`app/[locale]/page.tsx` is the only page. It composes section components in order: `Hero → AiLeaders → PainPoints → Approach → Services → CaseStudy → Process → Team → Faq → Contact`, plus `Header` / `Footer`. Each section is a self-contained component under `components/sections/` and reads its copy via `useTranslations(...)`. To add or reorder sections, edit this file **and** update the `links` array in `components/nav/Header.tsx` (the section's `id` must match the anchor used in nav).

`generateStaticParams` in `app/[locale]/layout.tsx` pre-renders one page per locale. Metadata (incl. OG, alternates, twitter) is generated there from the `meta` namespace in messages.

### Section layout convention

Most sections use a simple two-row layout: heading block (Eyebrow + h2 + optional lead) at the top with `max-w-3xl`, content below at full section width. The two-column `grid lg:grid-cols-[1fr_1.4fr]` pattern was deliberately removed from `Faq` and `Services` because the heading column left too much empty space — don't reintroduce it without a reason. `Approach` is the exception (it has a meaningful `tagline` pill in the left column).

### Lead intake (browser → Telegram)

The contact form in `components/sections/Contact.tsx` POSTs the lead **directly from the browser** to `https://api.telegram.org/bot<TOKEN>/sendMessage`. There is no backend.

- Required fields: `name`, `contact`. Everything else is optional.
- `NEXT_PUBLIC_TG_BOT_TOKEN` and `NEXT_PUBLIC_TG_CHAT_ID` are baked into the client bundle at build time. **This means the bot token is publicly visible** to anyone who inspects the page — accepted trade-off for static hosting. The bot only has permission to send messages to its own chat, so the worst case is spam to the lead group; mitigate by rotating the token via @BotFather.
- If either env is missing, the form silently logs to console and shows the success state (keeps dev painless).

In CI the secrets come from GitHub Actions: `TG_BOT_TOKEN`, `TG_CHAT_ID` (set in repo Settings → Secrets and variables → Actions). The workflow exposes them as `NEXT_PUBLIC_*` for the build only.

### Deployment

- Push to `main` triggers `.github/workflows/deploy.yml` → builds → uploads `out/` → publishes to GH Pages.
- `public/CNAME` (`magicwork.pro`) tells Pages the custom domain.
- `public/.nojekyll` disables Jekyll so `_next/` assets are served as-is.
- DNS at reg.ru: A records on `@` to GitHub Pages IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), CNAME on `www` → `<user>.github.io`.

### Styling conventions

- Use the design tokens from `@theme` (e.g. `bg-bg`, `text-text-muted`, `text-accent`, `font-display`) rather than raw hex / arbitrary Tailwind colors.
- Reusable elevation classes are defined in `globals.css`: `.elev-card`, `.elev-card-hover`, `.elev-cta`. Prefer these over hand-rolled `shadow-*` stacks for consistency.
- Animations use `framer-motion` with shared ease `[0.22, 1, 0.36, 1]` and the fade-up reveal `{opacity:0, y:16} → {opacity:1, y:0}` triggered via `whileInView` + `viewport={{ once: true, margin: "-80px" }}`. Always gate with `useReducedMotion()` for any motion that's not load-time hero choreography. CSS `prefers-reduced-motion` is also handled globally in `globals.css`.
- The brand mark in `components/ui/Logo.tsx` uses an inline SVG with a SMIL `animateTransform` shimmer on the inner `AI` text gradient. SMIL stays even with `prefers-reduced-motion` (intentional: it's a slow, soft glow, not movement).

### Static assets

`public/business-card.html` is a self-contained, printable 85×55 mm business card (front RU, back EN) styled to match the site. It pulls Google Fonts (Inter / JetBrains Mono / Fraunces) over the network and uses `@page` rules — open at `/business-card.html` and print to PDF. It has no relationship to the rest of the app.
