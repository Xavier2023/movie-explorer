import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/BreadCrumb";
import logo from "@/public/android-chrome-192x192.png";

// Types (matching TMDB TV response)
interface TvDetails {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
  homepage: string | null;
  created_by: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string | null }[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper: image URL (same as movies)
const imageUrl = (
  path: string | null,
  size: "w92" | "w342" | "w500" = "w500",
) => {
  if (!path) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Fetch functions (server‑only)
async function fetchTvDetails(id: string): Promise<TvDetails> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const res = await fetch(`${baseUrl}/tv/${id}?api_key=${apiKey}`);
  if (!res.ok) notFound();
  return res.json();
}

async function fetchTvCredits(id: string): Promise<Credits> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const res = await fetch(`${baseUrl}/tv/${id}/credits?api_key=${apiKey}`);
  if (!res.ok) return { id: Number(id), cast: [], crew: [] };
  return res.json();
}

// Metadata generation
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tv = await fetchTvDetails(id);
  return {
    title: tv.name,
    description: tv.overview.slice(0, 160),
    openGraph: {
      images: [imageUrl(tv.poster_path, "w500")],
    },
  };
}

// Format helpers
function formatReleaseDate(dateString: string): string {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Main component
export default async function TvDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [tv, credits] = await Promise.all([
    fetchTvDetails(id),
    fetchTvCredits(id),
  ]);

  // Extract director and writers from crew
  const director = credits.crew?.find((person) => person.job === "Director");
  const writers = credits.crew?.filter(
    (person) => person.department === "Writing",
  );
  const topCast = credits.cast?.slice(0, 12) || [];

  return (
    <>
      {/* Main Content with Background Image */}
      <main className="relative min-h-screen">
        {/* CSS Gradient Background (same as movies) */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

        <div className="relative z-10 container mx-auto px-4 py-6 max-w-8xl">
          <div className="mb-6 sticky top-20">
            <Breadcrumb title={tv.name} />{" "}
            {/* Reusing Breadcrumb – rename prop if needed */}
          </div>

          <div className="flex flex-col lg:flex-row gap-10 mt-4">
            {/* Poster */}
            <div className="lg:w-1/3">
              <div className="sticky top-28 rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={imageUrl(tv.poster_path, "w500")}
                    alt={tv.name}
                    fill
                    className="object-cover"
                    priority
                    fetchPriority="high"
                    loading="eager"
                    quality={75}
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  {tv.name}
                </h1>
                {tv.tagline && (
                  <p className="text-lg text-gray-200 italic mt-2 border-l-4 border-blue-500 pl-4">
                    {tv.tagline}
                  </p>
                )}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  First Air: {formatReleaseDate(tv.first_air_date)}
                </span>
                {tv.last_air_date && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    Last Air: {formatReleaseDate(tv.last_air_date)}
                  </span>
                )}
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium flex items-center gap-1">
                  ⭐ {tv.vote_average.toFixed(1)} (
                  {tv.vote_count.toLocaleString()} votes)
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  {tv.status}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                  {tv.number_of_seasons} Season
                  {tv.number_of_seasons !== 1 ? "s" : ""}
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full font-medium">
                  {tv.number_of_episodes} Episodes
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {tv.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300 transition"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-white">Synopsis</h2>
                <p className="text-gray-200 leading-relaxed">{tv.overview}</p>
              </div>

              {/* Cast & Crew */}
              {(director || writers?.length || topCast.length) && (
                <div className="bg-white/50 rounded-2xl shadow-md p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    🎭 Cast & Crew
                  </h2>
                  {director && (
                    <div className="mb-4 pb-3 border-b border-white/20">
                      <span className="font-semibold text-white">Director</span>
                      <p className="text-gray-100">{director.name}</p>
                    </div>
                  )}
                  {writers && writers.length > 0 && (
                    <div className="mb-4 pb-3 border-b border-white/20">
                      <span className="font-semibold text-white">
                        Writer{writers.length > 1 ? "s" : ""}
                      </span>
                      <p className="text-gray-100">
                        {writers.map((w) => w.name).join(", ")}
                      </p>
                    </div>
                  )}
                  {topCast.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-3">
                        Top Cast
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                        {topCast.map((actor) => (
                          <div
                            key={actor.id}
                            className="flex items-center gap-3 bg-white/30 rounded-xl p-2 hover:bg-white/50 transition"
                          >
                            {actor.profile_path ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={imageUrl(actor.profile_path, "w92")}
                                  alt={actor.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
                                🎬
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-white truncate">
                                {actor.name}
                              </p>
                              <p className="text-gray-200 text-xs truncate">
                                as {actor.character}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-white/50 rounded-2xl shadow-md p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  📊 Additional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tv.created_by && tv.created_by.length > 0 && (
                    <div className="md:col-span-2">
                      <dt className="font-semibold text-gray-200 text-sm">
                        Created by
                      </dt>
                      <dd className="text-gray-100">
                        {tv.created_by.map((c) => c.name).join(", ")}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-semibold text-gray-200 text-sm">
                      Seasons
                    </dt>
                    <dd className="text-white text-lg font-medium">
                      {tv.number_of_seasons}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-200 text-sm">
                      Episodes
                    </dt>
                    <dd className="text-white text-lg font-medium">
                      {tv.number_of_episodes}
                    </dd>
                  </div>
                  {tv.networks && tv.networks.length > 0 && (
                    <div className="md:col-span-2">
                      <dt className="font-semibold text-gray-200 text-sm">
                        Networks
                      </dt>
                      <dd className="text-gray-100">
                        {tv.networks.map((n) => n.name).join(", ")}
                      </dd>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <dt className="font-semibold text-gray-200 text-sm">
                      Production Companies
                    </dt>
                    <dd className="text-gray-100">
                      {tv.production_companies.map((c) => c.name).join(", ") ||
                        "N/A"}
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="font-semibold text-gray-200 text-sm">
                      Spoken Languages
                    </dt>
                    <dd className="text-gray-100">
                      {tv.spoken_languages
                        .map((l) => l.english_name)
                        .join(", ") || "N/A"}
                    </dd>
                  </div>
                  {tv.homepage && (
                    <div className="md:col-span-2">
                      <dt className="font-semibold text-gray-200 text-sm">
                        Official Website
                      </dt>
                      <dd>
                        <a
                          href={tv.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:underline break-all"
                        >
                          {tv.homepage}
                        </a>
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
