import Link from "next/link";
import { Book, Star, GitFork, TrendingUp } from "lucide-react";
import { repositories } from "@/data/repos";

const trendingRepos = [
  {
    owner: "vercel",
    name: "next.js",
    description: "The React Framework for the Web",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 124583,
    forks: 26891,
  },
  {
    owner: "tailwindlabs",
    name: "tailwindcss",
    description: "A utility-first CSS framework for rapid UI development",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 81234,
    forks: 4123,
  },
  {
    owner: "lucide-icons",
    name: "lucide",
    description: "Beautiful & consistent icon toolkit made by the community",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 11456,
    forks: 654,
  },
  {
    owner: "facebook",
    name: "react",
    description: "The library for web and native user interfaces",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 228123,
    forks: 46721,
  },
];

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export default function ExplorePage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-gh-accent" />
          <h1 className="text-2xl font-semibold text-gh-fg">Explore repositories</h1>
        </div>
        <p className="text-sm text-gh-fg-muted">
          Repositorios trending y populares en la comunidad. Encuentra herramientas para tus proyectos.
        </p>
      </header>

      <section aria-labelledby="trending-heading">
        <h2 id="trending-heading" className="text-base font-semibold text-gh-fg mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gh-success" />
          Trending this week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendingRepos.map((repo) => (
            <article
              key={`${repo.owner}/${repo.name}`}
              className="bg-gh-canvas-subtle border border-gh-border rounded-md p-4 hover:border-gh-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-gh-fg-muted" />
                  <span className="text-gh-accent font-semibold text-sm">
                    {repo.owner}/{repo.name}
                  </span>
                </div>
                <span className="text-xs text-gh-fg-muted border border-gh-border rounded-full px-2 py-0.5">
                  Public
                </span>
              </div>
              <p className="text-xs text-gh-fg-muted mb-3 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-gh-fg-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" /> {formatStars(repo.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" /> {formatStars(repo.forks)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="your-repos-heading">
        <h2 id="your-repos-heading" className="text-base font-semibold text-gh-fg mb-3">
          Your repositories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {repositories.map((repo) => (
            <Link
              key={repo.name}
              href={`/${repo.owner}/${repo.name}`}
              className="block bg-gh-canvas-subtle border border-gh-border rounded-md p-4 hover:border-gh-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gh-canvas"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-gh-fg-muted" />
                  <span className="text-gh-accent font-semibold text-sm">
                    {repo.owner}/{repo.name}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gh-fg-muted mb-3 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-gh-fg-muted">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" /> {repo.stars}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
