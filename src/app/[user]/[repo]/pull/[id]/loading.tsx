// Server component: skeleton de carga para la vista de Pull Request.

export default function PRLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Cargando pull request…">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 rounded bg-gh-canvas-subtle" />

      {/* PR title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 rounded bg-gh-canvas-subtle" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-full bg-gh-canvas-subtle" />
          <div className="h-4 w-48 rounded bg-gh-canvas-subtle" />
        </div>
      </div>

      {/* Banner skeleton */}
      <div className="h-16 rounded-lg border border-gh-border bg-gh-canvas-subtle" />

      {/* Layout main + sidebar */}
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gh-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 rounded-t bg-gh-canvas-subtle" />
            ))}
          </div>
          {/* Content */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md border border-gh-border bg-gh-canvas-subtle" />
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-72 shrink-0 space-y-4">
          <div className="h-40 rounded-md border border-gh-border bg-gh-canvas-subtle" />
          <div className="h-16 rounded-md border border-gh-border bg-gh-canvas-subtle" />
        </div>
      </div>
    </div>
  );
}
