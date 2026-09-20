# WICK demo — self-hosting package

## Fastest way to host

Upload **everything inside `ready-to-host`** to the root of any static website host. Its `index.html` must be at the website root. The folder includes the finished HTML, CSS, JavaScript, favicon, and both information pages. No build step, database, API keys, ChatGPT account, or server-side code is required.

Use an HTTPS address. The draw engine uses browser cryptography, which requires HTTPS (or localhost). Opening index.html by double-clicking it is not a supported preview method.

## Change the website

The `source` folder contains the editable React site, all components and styles, draw engine, tests, dependency lockfile, and prepared Supabase schema. It is independent of the original Sites hosting service.

With Node.js 22.13 or newer installed, open a terminal in `source` and run:

    npm ci
    npm run dev

To produce an updated upload folder:

    npm run build

Upload the contents of `source/dist` to your host. The build also creates real directories for `/how-it-works/` and `/transparency/`, so the information pages can be opened directly without special routing rules. This package assumes hosting at the domain root, not in a subfolder.

To preview the production build locally:

    npm run preview

To check the draw engine (including 500,000 simulated draws):

    npm test

## Main files

- `source/app/page.tsx`: spectator interface and demo ceremony
- `source/app/globals.css`: visual styling and animations
- `source/lib/simulation/config.mjs`: name, ticker, and tuning constants
- `source/lib/simulation/engine.mjs`: draw calculations and seeded replay
- `source/app/how-it-works/page.tsx`: mechanics page
- `source/app/transparency/page.tsx`: disclosure page
- `source/supabase/schema.sql`: preparation for a future live backend; not needed for this demo

## What this demo includes

Synthetic holders, prices, fees, local draw commitments, timed ceremonies, simulated wins, wallet tracking, local history, record replay and downloads. No funds are distributed and no wallet connection is requested.

Draws run independently in each viewer’s browser. History is session-local, not a shared permanent archive. Live token data, Supabase, and future Solana block randomness are not connected. A pasted address is stored only in that browser. Hosting this package on a public website makes the demo publicly visible; it does not retain the original private Sites access restrictions.

No credentials, environment secrets, Git history, or installed dependencies are included. Original build notes are in `source/IMPLEMENTATION.md`.
