import { MoveRight, GitBranch, Info } from "lucide-react";

interface MergeDirectionBannerProps {
  headBranch: string;
  baseBranch: string;
  status: "open" | "merged" | "closed";
}

const statusColors: Record<MergeDirectionBannerProps["status"], string> = {
  open: "border-gh-success/30 bg-gh-success/5",
  merged: "border-gh-done/30 bg-gh-done/5",
  closed: "border-gh-danger/30 bg-gh-danger/5",
};

const statusLabel: Record<MergeDirectionBannerProps["status"], string> = {
  open: "Wants to merge",
  merged: "Merged",
  closed: "Closed without merging",
};

export function MergeDirectionBanner({ headBranch, baseBranch, status }: MergeDirectionBannerProps) {
  return (
    <section
      aria-label="Merge direction"
      className={`border rounded-lg p-4 ${statusColors[status]}`}
    >
      <p className="text-xs text-gh-fg-muted mb-3 text-center font-medium uppercase tracking-wide">
        {statusLabel[status]} <span className="text-gh-fg">{headBranch}</span> →{" "}
        <span className="text-gh-fg">{baseBranch}</span>
      </p>
      <div className="grid grid-cols-[auto_auto_auto] justify-center items-center gap-x-4 gap-y-1">
        {/* Row 1: labels (sólo encima de los botones; celda central vacía) */}
        <span className="text-[10px] uppercase tracking-wider text-gh-fg-muted text-center">
          Desde
        </span>
        <span aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-wider text-gh-fg-muted text-center">
          Hacia
        </span>

        {/* Row 2: botón origen + flecha + botón destino (alineados verticalmente entre sí) */}
        <div className="flex items-center gap-2 bg-gh-accent/20 border border-gh-accent/40 rounded-lg px-4 py-2">
          <GitBranch className="w-4 h-4 text-gh-accent" />
          <span className="text-sm font-mono font-semibold text-gh-accent">{headBranch}</span>
        </div>

        <div className="flex items-center justify-center" aria-hidden="true">
          <MoveRight className="w-8 h-8 text-gh-fg-muted" />
        </div>

        <div className="flex items-center gap-2 bg-gh-success/20 border border-gh-success/40 rounded-lg px-4 py-2">
          <GitBranch className="w-4 h-4 text-gh-success" />
          <span className="text-sm font-mono font-semibold text-gh-success">{baseBranch}</span>
        </div>
      </div>

      {/* Reframe callout */}
      <div className="mt-4 pt-3 border-t border-gh-border/50 flex items-start gap-2 text-xs text-gh-fg-muted">
        <Info className="w-3.5 h-3.5 text-gh-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-gh-accent">Modelo mental explícito:</span>{" "}
          mostramos la dirección del merge como una flecha visual con etiquetas &quot;Desde/Hacia&quot;.
          GitHub clásico sólo lo dice en texto (<code>{headBranch}:{baseBranch}</code>), lo que
          asume que ya internalizaste la sintaxis de git.
        </p>
      </div>
    </section>
  );
}
