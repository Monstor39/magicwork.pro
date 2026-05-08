# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`). Do not switch to npm/yarn.

- `pnpm dev` — Next.js dev server on http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — ESLint (flat config, `eslint.config.mjs`)

There is no test runner configured. There is no typecheck script — run `pnpm exec tsc --noEmit` if you need one.

`pnpm lint` currently reports two **pre-existing** errors in `components/hero/HeroBackdrop.tsx` and `components/sections/CaseStudy.tsx` (`react-hooks/set-state-in-effect`). They predate any current task — don't be confused by them when validating your own changes. Lint your own files specifically: `pnpm exec eslint <paths>`.

## Architecture

Single-page marketing site for **MagicWork** — a localized landing assembled from section components, with one lead-intake API route. Stack: **Next.js 16.2.6 App Router + React 19.2.4 + Tailwind CSS v4 + next-intl + Resend**.

### Things that diverge from defaults

- **Middleware lives in `proxy.ts`, not `middleware.ts`.** It runs the next-intl locale middleware. Don't move/rename it — that's a deliberate convention of this Next.js version (see AGENTS.md).
- **Tailwind v4 — no `tailwind.config.{js,ts}`.** Theme tokens (`--color-bg`, `--color-accent`, `--font-display`, etc.) are declared in `app/globals.css` inside `@theme { ... }`. Add new design tokens there, not in a config file.
- **Path alias:** `@/*` → project root (`tsconfig.json`).
- **Async `params`:** route handlers and pages destructure `params` as a `Promise` (e.g. `params: Promise<{ locale: string }>`). Always `await` it. This is the current Next conventions — do not "fix" it.
- **`setRequestLocale(locale)`** must be called at the top of every locale-scoped server component (page + layout) to enable static rendering with next-intl.

### Routing & i18n

- Locales: `ru` (default), `en`. Configured in `i18n/routing.ts` with `localePrefix: "as-needed"` — the default locale has no prefix (`/`), `en` is at `/en`.
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

### Lead-intake API

`app/api/lead/route.ts` (`POST /api/lead`) accepts a JSON lead payload and fans it out to:
- **Resend** (email) if `RESEND_API_KEY` is set — `LEAD_FROM_EMAIL` → `LEAD_EMAIL`
- **Telegram** if both `TG_BOT_TOKEN` and `TG_CHAT_ID` are set
- If neither is configured, the lead is logged to stdout and the request still returns `{ ok: true }` (intentional — keeps form working in dev).

Required fields are `name` and `contact`; everything else is optional. See `.env.local.example` for the full env list, including `NEXT_PUBLIC_SITE_URL` used by metadata + sitemap.

### Styling conventions

- Use the design tokens from `@theme` (e.g. `bg-bg`, `text-text-muted`, `text-accent`, `font-display`) rather than raw hex / arbitrary Tailwind colors.
- Reusable elevation classes are defined in `globals.css`: `.elev-card`, `.elev-card-hover`, `.elev-cta`. Prefer these over hand-rolled `shadow-*` stacks for consistency.
- Animations use `framer-motion` with shared ease `[0.22, 1, 0.36, 1]` and the fade-up reveal `{opacity:0, y:16} → {opacity:1, y:0}` triggered via `whileInView` + `viewport={{ once: true, margin: "-80px" }}`. Always gate with `useReducedMotion()` for any motion that's not load-time hero choreography. CSS `prefers-reduced-motion` is also handled globally in `globals.css`.
- The brand mark in `components/ui/Logo.tsx` uses an inline SVG with a SMIL `animateTransform` shimmer on the inner `AI` text gradient. SMIL stays even with `prefers-reduced-motion` (intentional: it's a slow, soft glow, not movement).

### Static assets

`public/business-card.html` is a self-contained, printable 85×55 mm business card (front RU, back EN) styled to match the site. It pulls Google Fonts (Inter / JetBrains Mono / Fraunces) over the network and uses `@page` rules — open at `/business-card.html` and print to PDF. It has no relationship to the rest of the app.
