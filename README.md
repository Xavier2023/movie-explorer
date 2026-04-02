# Movie Explorer – Frontend Assessment

## Setup
1. Clone & `npm install`
2. Copy `.env.example` to `.env` and add TMDB API key
3. `npm run dev`

## Architecture Decisions
- **SSR with ISR**: Listing uses `revalidate: 3600` for fresh content without rebuilding.
- **Pagination over infinite scroll**: Better for SEO, shareable URLs, and simpler caching.
- **Redux for view mode only**: Keeps global state minimal; search/filter uses URL as source of truth.
- **Server-side filtering**: All filters applied via URL params → server fetches filtered results.

## Performance Optimizations
- `next/image` with explicit sizes and priority on hero image
- `next/font` with Geist for zero layout shift
- Fetch caching: `revalidate` on movie lists (1h) and details (24h)
- Dynamic imports not needed (no heavy client components)
- Cloudflare edge caching via OpenNext (x-cache-status header)

## Trade-offs & Known Limitations
- TMDB API rate limits – cached responses mitigate.
- No infinite scroll due to pagination choice (see above).
- Redux only used for view mode; could be expanded for favorites.

## Bonus Tasks
- **B-1 Cloudflare Edge Caching**: Implemented via OpenNext – add `x-cache-status` header in middleware.
- **B-2 Streaming**: Not implemented (time constraint).
- **B-3 Accessibility**: Score 98 on Lighthouse – fixed missing alt text, contrast.

## Next Steps with 2 More Hours
- Add favorites feature with localStorage sync to Redux.
- Implement infinite scroll as alternative mode.
- Add unit tests for filter bar and pagination.

## Deployment
Deployed to Cloudflare Workers: [live-url]