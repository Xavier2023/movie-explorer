# Movie Explorer – TMDB Frontend Assessment

**Live URL:** [https://movie-explorer-your-name.vercel.app](https://movie-explorer-your-name.vercel.app)  
**Repository:** [https://github.com/your-username/frontend-assessment-your-name](https://github.com/your-username/frontend-assessment-your-name)

---

## Why Vercel instead of Cloudflare Workers?

Although the assessment prefers Cloudflare Workers, I chose **Vercel** for these reasons:

- **Native Next.js support** – Vercel is built by the same team as Next.js, offering zero‑configuration deployment, automatic ISR (Incremental Static Regeneration), and built‑in image optimisation with `next/image`.
- **Faster development** – Preview deployments for every Git push, instant rollbacks, and no need to configure `wrangler.toml` or the OpenNext adapter. This saved time that was invested in performance and feature completeness.
- **Edge caching is still available** – Vercel’s global Edge Network caches static assets and API responses via `Cache-Control` headers, achieving similar performance to Cloudflare Workers.
- **Free tier is generous** – No hidden costs or complex setup, allowing me to focus on the core requirements.

The trade‑off is losing the `x-cache-status` bonus (B‑1), but all other required metrics (LCP, CLS, INP) are met and exceed the targets.

---

## Setup Instructions (under 5 commands)

1. **Clone the repository**
   git clone https://github.com/your-username/frontend-assessment-your-name.git
   cd frontend-assessment-your-name

2. **Install dependencies**
npm install

3. **Set up environment variables**
cp .env.example .env.local
Then add your TMDB API key to .env.local (get one for free at TMDB).

4. **Run the development server**
npm run dev
Open http://localhost:3000 to see the app.

5. **Build for production (optional)**
npm run build && npm start



## Folder Structure (feature‑based)

├── app/                    # Next.js App Router pages (server components)
│   ├── movie/[id]/         # Dynamic detail page
│   ├── layout.tsx          # Root layout with fonts & preconnect
│   ├── page.tsx            # Listing page (server component)
│   ├── loading.tsx         # Route‑level skeleton
│   └── error.tsx           # Error boundary
├── components/             # Reusable UI components
│   ├── MovieCard.tsx       # Movie card (client component)
│   ├── MovieList.tsx       # Grid/list wrapper (client, Redux)
│   ├── FilterControls.tsx  # Search bar + filters + clear button
│   ├── Pagination.tsx      # Numbered pagination
│   └── ui/                 # Custom dropdown (SimpleSelect)
├── lib/                    # API clients and utilities
│   └── tmdb.ts             # TMDB fetch functions with cache options
├── store/                  # Redux slice for view mode (only)
├── types/                  # Shared TypeScript interfaces
└── public/                 # Static assets (favicon, placeholder)