# Revolut — motion study

A scroll-driven motion study reconstructing the Revolut homepage, built with **Next.js (App Router)** and TypeScript. It features a banking hero with a rotating 3D account tile, savings scenes, a rotating card ring, an AI section, security orbits, and an investing cloud — all animated from a single scroll-choreography client component.

> Local design reconstruction. Not affiliated with Revolut. Product screens show illustrative data and no banking services are provided.

## Tech stack

- [Next.js](https://nextjs.org) App Router
- React 19 + TypeScript
- Self-hosted fonts via `next/font/local` (Aeonik Pro, Inter)
- Image optimization via `next/image`
- Scroll animation in a single `"use client"` component (`components/site-motion.tsx`)

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the development server      |
| `npm run build` | Create a production build         |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Run Next.js/ESLint checks         |

## Project structure

```
app/
  layout.tsx        # Metadata, fonts, root layout
  page.tsx          # Full page markup (server component)
  globals.css       # Styles
components/
  site-motion.tsx   # Scroll-driven animation ("use client")
public/
  assets/           # Images and fonts
next.config.mjs     # Security headers
```

## Security headers

Baseline response headers (`X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`) are configured in `next.config.mjs`.
