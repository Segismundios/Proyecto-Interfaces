// Server component: skeleton de carga para la ruta dinámica del repo.
// loading.tsx actúa como Suspense boundary automático en Next.js App Router.

export default function RepoLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Cargando repositorio…">
      {/* Skeleton del header del repo */}
      <div className="pb-4 border-b border-gh-border space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gh-canvas-subtle" />
          <div className="h-6 w-64 rounded bg-gh-canvas-subtle" />
          <div className="h-5 w-16 rounded-full bg-gh-canvas-subtle" />
        </div>
        <div className="h-4 w-96 rounded bg-gh-canvas-subtle" />
        <div className="flex gap-2">
          <div className="h-7 w-24 rounded-md bg-gh-canvas-subtle" />
          <div className="h-7 w-20 rounded-md bg-gh-canvas-subtle" />
          <div className="h-7 w-20 rounded-md bg-gh-canvas-subtle" />
        </div>
      </div>

      {/* Skeleton de tabs */}
      <div className="flex gap-4 border-b border-gh-border pb-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 rounded-t bg-gh-canvas-subtle" />
        ))}
      </div>

      {/* Skeleton del file browser */}
      <div className="border border-gh-border rounded-md overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-gh-border last:border-b-0"
          >
            <div className="w-4 h-4 rounded bg-gh-canvas-subtle" />
            <div className="h-4 rounded bg-gh-canvas-subtle" style={{ width: `${40 + i * 15}%` }} />
            <div className="ml-auto h-3 w-40 rounded bg-gh-canvas-subtle" />
          </div>
        ))}
      </div>
    </div>
  );
}
