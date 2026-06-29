// Mock de ramas por repositorio. Sigue el patrón de `repoFiles` en files.ts:
// un Record keyed por nombre de repo. Alimenta los selectores de branch del
// flujo "crear pull request" (QuickActions + tab del repo) y el selector de
// rama del FileBrowser. La primera rama de cada lista es la rama por defecto.
export const DEFAULT_BRANCH = "main";

export const repoBranches: Record<string, string[]> = {
  "proyecto-interfaces": [
    "main",
    "develop",
    "feature/settings-redesign",
    "feature/home-dashboard",
    "feature/folder-download",
    "fix/pr-visualization",
  ],
  "algoritmos-avanzados": ["main", "develop", "fix/binary-search"],
  "api-rest-tareas": ["main", "develop", "feature/auth-jwt"],
  "notas-privadas": ["main"],
  "dotfiles": ["main", "feature/zsh-plugins"],
  "ml-clasificador": ["main", "develop", "feature/data-augmentation"],
};

/** Devuelve las ramas de un repo, con `main` como fallback seguro. */
export function getBranches(repoName: string): string[] {
  return repoBranches[repoName] ?? [DEFAULT_BRANCH];
}
