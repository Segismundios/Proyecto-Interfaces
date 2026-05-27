# Documentacion del Proyecto: GitHub UX Improved

## Tabla de Contenidos

1. [Descripcion General](#1-descripcion-general)
2. [Requisitos y Setup](#2-requisitos-y-setup)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Sistema de Tipos](#4-sistema-de-tipos)
5. [Datos Mock](#5-datos-mock)
6. [Configuracion de Estilos](#6-configuracion-de-estilos)
7. [Funciones Utilitarias](#7-funciones-utilitarias)
8. [Componentes UI Base](#8-componentes-ui-base)
9. [Componentes de Layout](#9-componentes-de-layout)
10. [Vista 1: Home Dashboard (Mejora 1)](#10-vista-1-home-dashboard---mejora-1)
11. [Vista 2: Settings (Mejora 2)](#11-vista-2-settings---mejora-2)
12. [Vista 3: Repositorio (Mejoras 3 y 4)](#12-vista-3-repositorio---mejoras-3-y-4)
13. [Vista 4: Pull Request (Mejora 5)](#13-vista-4-pull-request---mejora-5)
14. [Flujo de Datos y Relaciones entre Componentes](#14-flujo-de-datos-y-relaciones-entre-componentes)
15. [Rutas de la Aplicacion](#15-rutas-de-la-aplicacion)
16. [Decisiones Tecnicas](#16-decisiones-tecnicas)

---

## 1. Descripcion General

Este proyecto es un **clon de la interfaz de GitHub** construido como prototipo funcional (frontend-only, sin backend) que implementa 5 mejoras de usabilidad identificadas mediante investigacion con usuarios (estudiantes de computacion y desarrolladores junior).

Las mejoras abordadas son:

| # | Mejora | Problema Original | Solucion Implementada |
|---|--------|-------------------|----------------------|
| 1 | Home Dashboard | La pagina de inicio de GitHub muestra un feed social poco util para el trabajo diario | Dashboard con repos favoritos, mas usados, PRs recientes y acciones rapidas |
| 2 | Reorganizacion de Settings | Tokens de acceso estan en Settings > Developer Settings > PAT (3 niveles de profundidad) | Tokens y SSH keys como items de primer nivel en el sidebar de configuracion |
| 3 | Toggle de Visibilidad | Cambiar visibilidad del repo requiere ir a Settings > Danger Zone | Boton directo en el header del repositorio con modal de confirmacion |
| 4 | Descarga de Carpetas | No existe forma nativa de descargar una sola carpeta sin clonar todo el repo | Boton de descarga que aparece al pasar el mouse sobre cada carpeta |
| 5 | Visualizacion de PR | La direccion del merge es texto pequeno y facil de perder; el progreso de review esta disperso | Banner visual de direccion del merge y barra de progreso de revisiones visible para todos |

---

## 2. Requisitos y Setup

### 2.1 Requisitos Previos

- **Node.js** >= 18.17.0 (requerido por Next.js 14)
- **npm** >= 9.x
- **nvm** (opcional, recomendado para manejar versiones de Node)

### 2.2 Instalacion

```bash
# Si usas nvm y tu version de Node es menor a 18.17:
nvm install 18
nvm use 18

# Clonar o navegar al directorio del proyecto
cd github-clone

# Instalar dependencias
npm install
```

### 2.3 Ejecucion

```bash
# Modo desarrollo (con hot reload)
npm run dev
# Abre http://localhost:3000

# Build de produccion
npm run build

# Ejecutar build de produccion
npm start

# Linting
npm lint
```

### 2.4 Dependencias del Proyecto

| Dependencia | Version | Proposito |
|-------------|---------|-----------|
| `next` | 14.2.35 | Framework React con App Router, SSR y file-based routing |
| `react` | ^18 | Biblioteca de UI |
| `react-dom` | ^18 | Renderizado DOM de React |
| `lucide-react` | ^1.7.0 | Iconos SVG (alternativa a GitHub Octicons) |
| `typescript` | ^5 | Tipado estatico |
| `tailwindcss` | ^3.4.1 | Framework CSS utility-first |
| `postcss` | ^8 | Procesador CSS (requerido por Tailwind) |
| `eslint` | ^8 | Linter para JavaScript/TypeScript |
| `eslint-config-next` | 14.2.35 | Reglas ESLint especificas de Next.js |

---

## 3. Estructura del Proyecto

```
github-clone/
├── public/                          # Archivos estaticos
├── src/
│   ├── app/                         # Paginas (App Router de Next.js)
│   │   ├── layout.tsx               # Layout raiz (Navbar + contenedor)
│   │   ├── page.tsx                 # "/" - Home Dashboard
│   │   ├── globals.css              # Estilos globales
│   │   ├── settings/
│   │   │   ├── layout.tsx           # Layout de settings (sidebar)
│   │   │   ├── page.tsx             # "/settings" - Perfil
│   │   │   ├── tokens/
│   │   │   │   └── page.tsx         # "/settings/tokens" (protegido por SecurityGate)
│   │   │   └── ssh-keys/
│   │   │       └── page.tsx         # "/settings/ssh-keys" (protegido por SecurityGate)
│   │   ├── explore/
│   │   │   └── page.tsx             # "/explore" - Trending y tus repos
│   │   └── [user]/[repo]/
│   │       ├── page.tsx             # "/:user/:repo" - Vista de repo
│   │       └── pull/[id]/
│   │           └── page.tsx         # "/:user/:repo/pull/:id" - Vista de PR
│   ├── components/                  # Componentes reutilizables
│   │   ├── ui/                      # Primitivos de UI
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SecurityGate.tsx     # Gate de ruta para credenciales sensibles
│   │   │   ├── Tabs.tsx
│   │   │   └── Toggle.tsx
│   │   ├── layout/                  # Componentes de layout global
│   │   │   └── Navbar.tsx
│   │   ├── home/                    # Componentes del dashboard
│   │   │   ├── FavoriteRepos.tsx
│   │   │   ├── MostUsedRepos.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── settings/                # Componentes de configuracion
│   │   │   └── SettingsSidebar.tsx
│   │   ├── repo/                    # Componentes de repositorio
│   │   │   ├── RepoHeader.tsx
│   │   │   ├── FileBrowser.tsx
│   │   │   └── ReadmePreview.tsx
│   │   └── pr/                      # Componentes de pull request
│   │       ├── MergeDirectionBanner.tsx
│   │       ├── ReviewProgressBar.tsx
│   │       ├── DiffViewer.tsx
│   │       ├── PRTimeline.tsx
│   │       └── CommitList.tsx
│   ├── context/                     # Providers de estado global (localStorage)
│   │   ├── FavoritesContext.tsx     # Repos marcados como favoritos
│   │   ├── VisibilityContext.tsx    # Overrides de visibilidad por repo
│   │   └── SecurityContext.tsx      # Verificacion de password con TTL 30 min
│   ├── data/                        # Datos mock (hardcodeados)
│   │   ├── users.ts
│   │   ├── repos.ts
│   │   ├── files.ts
│   │   ├── tokens.ts
│   │   ├── sshKeys.ts
│   │   └── pullRequests.ts
│   ├── types/                       # Definiciones de tipos TypeScript
│   │   └── index.ts
│   └── lib/                         # Funciones utilitarias
│       └── utils.ts
├── tailwind.config.ts               # Configuracion de Tailwind con tema GitHub
├── tsconfig.json                    # Configuracion de TypeScript
├── package.json
└── next.config.mjs
```

### Convencion de directorios

- **`app/`**: Cada archivo `page.tsx` define una ruta. Los directorios con `[nombre]` son rutas dinamicas.
- **`components/`**: Organizados por dominio funcional (`ui/`, `home/`, `settings/`, `repo/`, `pr/`).
- **`context/`**: Providers de React Context para estado global ligero. Toda la persistencia ocurre en `localStorage` (no sessionStorage, no backend).
- **`data/`**: Cada archivo exporta constantes con datos mock tipados.
- **`types/`**: Archivo unico con todas las interfaces compartidas.
- **`lib/`**: Utilidades puras sin dependencias de React.

---

## 4. Sistema de Tipos

**Archivo:** `src/types/index.ts`

Todas las interfaces del proyecto estan centralizadas en este archivo. Cada archivo de datos y componente importa sus tipos desde aqui.

### 4.1 User

```typescript
export interface User {
  username: string;       // Identificador unico (e.g., "javier-lopez")
  displayName: string;    // Nombre visible (e.g., "Javier Lopez")
  avatarUrl: string;      // URL de imagen de avatar
  bio: string;            // Biografia corta
}
```

Usado en: Navbar, Home Dashboard (sidebar), Settings, PR Timeline, Review Progress.

### 4.2 Repository

```typescript
export interface Repository {
  owner: string;          // Username del dueno
  name: string;           // Nombre del repositorio
  description: string;    // Descripcion corta
  language: string;       // Lenguaje principal (e.g., "TypeScript")
  languageColor: string;  // Color hex del lenguaje (e.g., "#3178c6")
  stars: number;          // Cantidad de estrellas
  forks: number;          // Cantidad de forks
  visibility: "public" | "private";
  isFavorite: boolean;    // Si el usuario lo marco como favorito
  lastAccessed: string;   // Fecha ISO del ultimo acceso (para ordenar "mas usados")
  updatedAt: string;      // Fecha ISO de ultima actualizacion
}
```

Usado en: Home (FavoriteRepos, MostUsedRepos), Repo page (RepoHeader, FileBrowser).

### 4.3 FileEntry

```typescript
export interface FileEntry {
  name: string;                // Nombre del archivo o carpeta
  type: "file" | "folder";    // Tipo de entrada
  lastCommitMessage: string;   // Mensaje del ultimo commit que lo modifico
  lastCommitDate: string;      // Fecha ISO del ultimo commit
  children?: FileEntry[];      // Solo para carpetas: archivos contenidos
}
```

Usado en: FileBrowser. Estructura recursiva que permite carpetas anidadas.

### 4.4 PullRequest

```typescript
export interface PullRequest {
  id: number;                 // Numero del PR
  repoOwner: string;          // Dueno del repo
  repoName: string;           // Nombre del repo
  title: string;              // Titulo del PR
  body: string;               // Descripcion (Markdown)
  status: "open" | "merged" | "closed";
  author: string;             // Username del autor
  baseBranch: string;         // Rama destino (e.g., "main")
  headBranch: string;         // Rama origen (e.g., "feature/settings-redesign")
  createdAt: string;          // Fecha ISO de creacion
  commits: Commit[];          // Lista de commits incluidos
  reviewers: Reviewer[];      // Reviewers asignados con su estado
  diffFiles: DiffFile[];      // Archivos cambiados con diffs
  comments: PRComment[];      // Comentarios y reviews
}
```

Es el tipo mas complejo. Contiene toda la informacion necesaria para renderizar la vista completa de un PR.

### 4.5 Commit

```typescript
export interface Commit {
  sha: string;       // Hash corto del commit (e.g., "a1b2c3d")
  message: string;   // Mensaje del commit
  author: string;    // Username del autor
  date: string;      // Fecha ISO
}
```

### 4.6 Reviewer

```typescript
export interface Reviewer {
  username: string;
  status: "pending" | "approved" | "changes_requested" | "commented";
}
```

Los cuatro estados posibles determinan el icono y color que se muestra en ReviewProgressBar.

### 4.7 DiffFile, DiffHunk, DiffLine

```typescript
export interface DiffFile {
  filename: string;       // Ruta del archivo modificado
  additions: number;      // Lineas agregadas
  deletions: number;      // Lineas eliminadas
  hunks: DiffHunk[];      // Secciones del diff
}

export interface DiffHunk {
  header: string;         // Header del hunk (e.g., "@@ -10,7 +10,9 @@")
  lines: DiffLine[];      // Lineas del diff
}

export interface DiffLine {
  type: "addition" | "deletion" | "context";  // Tipo de linea
  content: string;                             // Contenido de la linea
  oldLineNumber?: number;                      // Numero de linea en el archivo original
  newLineNumber?: number;                      // Numero de linea en el archivo nuevo
}
```

Estructura jerarquica: DiffFile > DiffHunk > DiffLine. Modela un diff unificado de Git.

### 4.8 PRComment

```typescript
export interface PRComment {
  author: string;
  body: string;
  createdAt: string;
  type: "comment" | "review" | "system";  // Determina el icono y estilo
}
```

### 4.9 PersonalAccessToken

```typescript
export interface PersonalAccessToken {
  id: string;
  name: string;              // Nombre descriptivo del token
  scopes: string[];          // Permisos (e.g., ["repo", "workflow"])
  createdAt: string;         // Fecha ISO
  lastUsed: string;          // Fecha ISO o "Never"
  expiresAt: string;         // Fecha ISO de expiracion
  tokenPreview: string;      // Vista previa enmascarada (e.g., "ghp_****...x3Kf")
}
```

### 4.10 SSHKey

```typescript
export interface SSHKey {
  id: string;
  title: string;             // Nombre descriptivo
  fingerprint: string;       // SHA256 fingerprint
  addedAt: string;           // Fecha ISO
  lastUsed: string;          // Fecha ISO o "Never"
}
```

---

## 5. Datos Mock

Todos los datos del proyecto estan hardcodeados en `src/data/`. No hay llamadas a APIs ni base de datos.

### 5.1 users.ts

Exporta dos constantes:

- **`currentUser`**: El usuario "logueado" (Javier Lopez, basado en el User Persona de la investigacion).
- **`collaborators`**: Array de 3 usuarios colaboradores (Maria Garcia, Carlos Ruiz, Ana Martinez), usados como reviewers y autores de commits/PRs.

Cada usuario tiene un avatar generado dinamicamente desde `ui-avatars.com` con diferentes colores de fondo.

### 5.2 repos.ts

Exporta un array de 6 repositorios que representan el perfil tipico de un estudiante de computacion:

| Repo | Visibilidad | Favorito | Lenguaje | Estrellas |
|------|-------------|----------|----------|-----------|
| proyecto-interfaces | public | si | TypeScript | 12 |
| algoritmos-avanzados | public | si | Python | 8 |
| api-rest-tareas | public | no | JavaScript | 5 |
| notas-privadas | private | no | Markdown | 0 |
| dotfiles | public | no | Shell | 3 |
| ml-clasificador | private | si | Python | 15 |

Los campos `isFavorite` y `lastAccessed` son clave para las funcionalidades de la Mejora 1 (Home Dashboard).

### 5.3 files.ts

Exporta un `Record<string, FileEntry[]>` indexado por nombre de repositorio. Actualmente solo tiene entradas para `"proyecto-interfaces"` con una estructura de archivos realista que incluye carpetas anidadas (`src/components/`, `src/app/`, `src/data/`, `public/`) y archivos raiz (`README.md`, `package.json`, etc.).

La estructura recursiva (carpetas con `children`) permite demostrar la Mejora 4 (descarga de carpetas).

### 5.4 pullRequests.ts

Exporta un array de 3 pull requests:

1. **PR #1** (open): "feat: add improved settings page with token management"
   - 4 commits, 3 reviewers (1 approved, 1 changes_requested, 1 pending)
   - 4 archivos en el diff con lineas detalladas
   - 3 comentarios en el timeline
   - Es el PR principal usado para demostrar la Mejora 5

2. **PR #2** (merged): "feat: add home dashboard with favorite repos"
   - 2 commits, 2 reviewers (ambos approved)
   - Sin archivos de diff (solo metadata)

3. **PR #3** (open): "fix: correct binary search edge case"
   - Pertenece al repo `algoritmos-avanzados`
   - 1 commit, 1 reviewer pending

### 5.5 tokens.ts

Exporta 3 tokens de acceso personal con nombres realistas (`laptop-dev-token`, `ci-deploy-token`, `vscode-extension`), cada uno con diferentes scopes y fechas.

### 5.6 sshKeys.ts

Exporta 2 llaves SSH (`Laptop personal - Ubuntu`, `PC Lab Universidad`) con fingerprints SHA256 simulados.

---

## 6. Configuracion de Estilos

### 6.1 Tailwind Config (`tailwind.config.ts`)

Se extiende el tema de Tailwind con una paleta de colores personalizada bajo el prefijo `gh-` que replica el tema oscuro de GitHub:

| Token | Hex | Uso |
|-------|-----|-----|
| `gh-canvas` | `#0d1117` | Fondo principal |
| `gh-canvas-subtle` | `#161b22` | Fondo de tarjetas y headers |
| `gh-canvas-inset` | `#010409` | Fondo empotrado |
| `gh-border` | `#30363d` | Bordes y separadores |
| `gh-fg` | `#e6edf3` | Texto principal |
| `gh-fg-muted` | `#848d97` | Texto secundario |
| `gh-accent` | `#58a6ff` | Links y acentos (azul) |
| `gh-accent-emphasis` | `#1f6feb` | Acento enfatico |
| `gh-success` | `#3fb950` | Estado exitoso / PR open (verde) |
| `gh-danger` | `#f85149` | Errores / PR closed (rojo) |
| `gh-warning` | `#d29922` | Advertencias / pendiente (amarillo) |
| `gh-done` | `#a371f7` | Completado / PR merged (morado) |
| `gh-btn-bg` | `#21262d` | Fondo de botones default |
| `gh-btn-hover` | `#30363d` | Hover de botones |
| `gh-btn-primary` | `#238636` | Boton primario (verde) |
| `gh-btn-primary-hover` | `#2ea043` | Hover boton primario |
| `gh-diff-add` | `#0d4429` | Fondo contexto adicion |
| `gh-diff-del` | `#67060c` | Fondo contexto eliminacion |
| `gh-diff-add-bg` | `rgba(46,160,67,0.15)` | Fondo linea de adicion |
| `gh-diff-del-bg` | `rgba(248,81,73,0.15)` | Fondo linea de eliminacion |

### 6.2 Estilos Globales (`globals.css`)

```css
body {
  color: #e6edf3;           /* gh-fg */
  background: #0d1117;      /* gh-canvas */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
    Helvetica, Arial, sans-serif;  /* Stack de fuentes de GitHub */
}

* {
  scrollbar-color: #30363d #0d1117;  /* Scrollbar tematizado */
}
```

El tema es **exclusivamente dark**. No hay soporte para tema claro ya que simplifica la implementacion y resulta visualmente mas impactante para la demostracion.

---

## 7. Funciones Utilitarias

**Archivo:** `src/lib/utils.ts`

### timeAgo(dateString: string): string

Convierte una fecha ISO a un formato relativo legible:

| Diferencia | Resultado |
|------------|-----------|
| < 60 segundos | `"just now"` |
| < 60 minutos | `"5m ago"` |
| < 24 horas | `"3h ago"` |
| < 30 dias | `"2d ago"` |
| >= 30 dias | `"1mo ago"` |

Usado en: MostUsedRepos, RecentActivity, FileBrowser, PRTimeline, CommitList, SSH Keys page.

### formatDate(dateString: string): string

Convierte una fecha ISO a formato localizado (e.g., `"Apr 8, 2026"`).

Usado en: Tokens page (fechas de creacion/expiracion), SSH Keys page (fecha de adicion).

---

## 8. Componentes UI Base

Directorio: `src/components/ui/`

Estos son los primitivos de interfaz reutilizados en todo el proyecto. Todos aceptan `children` y/o `className` para composicion flexible.

### 8.1 Avatar (`Avatar.tsx`)

Renderiza una imagen circular para avatares de usuario.

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `src` | `string` | requerido | URL de la imagen |
| `alt` | `string` | requerido | Texto alternativo |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamano: 20px / 32px / 64px |

**Usado en:** Navbar, Home sidebar, Settings, PRTimeline, CommitList, ReviewProgressBar, PR page header.

### 8.2 Badge (`Badge.tsx`)

Etiqueta de estado con color segun variante.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `variant` | `"success" \| "danger" \| "warning" \| "accent" \| "muted" \| "done"` | Determina color de fondo, texto y borde |
| `children` | `ReactNode` | Contenido del badge |

Mapeo de variantes:
- `success` → verde (PR open, elementos activos)
- `danger` → rojo (PR closed, errores)
- `warning` → amarillo (repo privado, pendientes)
- `accent` → azul (labels, links)
- `muted` → gris (scopes de tokens, visibilidad)
- `done` → morado (PR merged, completado)

**Usado en:** RecentActivity, RepoHeader, Repo PR list, PR page, Token scopes, PR labels.

### 8.3 Button (`Button.tsx`)

Boton estilizado con multiples variantes.

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `variant` | `"default" \| "primary" \| "danger" \| "outline"` | `"default"` | Estilo visual |
| `size` | `"sm" \| "md"` | `"md"` | Tamano del padding |
| `children` | `ReactNode` | requerido | Contenido (texto + iconos) |
| `className` | `string` | `""` | Clases adicionales |
| `...props` | `ButtonHTMLAttributes` | — | Props nativas de `<button>` |

Variantes:
- `default` → fondo gris oscuro con borde
- `primary` → fondo verde (#238636)
- `danger` → fondo rojo translucido, hover rojo solido
- `outline` → fondo transparente con borde

**Usado en:** Todas las paginas interactivas (Settings, Repo, PR).

### 8.4 Card (`Card.tsx`)

Contenedor con fondo subtle, borde y bordes redondeados.

| Prop | Tipo | Default |
|------|------|---------|
| `children` | `ReactNode` | requerido |
| `className` | `string` | `""` |

**Usado en:** FavoriteRepos, Settings page (cards de acceso rapido).

### 8.5 Modal (`Modal.tsx`)

**Componente cliente** (`"use client"`). Dialog modal con overlay oscuro.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `isOpen` | `boolean` | Controla visibilidad |
| `onClose` | `() => void` | Callback al cerrar (clic en overlay o boton X) |
| `title` | `string` | Titulo en el header del modal |
| `children` | `ReactNode` | Contenido del cuerpo |

Estructura interna:
- Overlay negro semitransparente (cierra al hacer clic)
- Contenedor centrado con max-width 512px
- Header con titulo y boton de cerrar
- Area de contenido con padding

**Usado en:** Tokens (crear token), SSH Keys (agregar key), RepoHeader (confirmar cambio de visibilidad).

### 8.6 Tabs (`Tabs.tsx`)

**Componente cliente**. Navegacion por pestanas con indicador activo.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `tabs` | `Tab[]` | Lista de pestanas |
| `activeTab` | `string` | ID de la pestana activa |
| `onTabChange` | `(tabId: string) => void` | Callback al cambiar |

Cada `Tab`:
```typescript
{ id: string; label: string; count?: number; icon?: ReactNode }
```

El tab activo muestra un borde inferior azul (`border-gh-accent`). Los contadores se muestran como badges circulares.

**Usado en:** Repo page (Code, Issues, PRs, Actions), PR page (Conversation, Commits, Files Changed).

### 8.7 Toggle (`Toggle.tsx`)

**Componente cliente**. Interruptor deslizante (switch).

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `checked` | `boolean` | Estado actual |
| `onChange` | `(checked: boolean) => void` | Callback al cambiar |
| `label` | `string?` | Texto opcional junto al toggle |
| `disabled` | `boolean?` | Si esta deshabilitado |

Implementa `role="switch"` con `aria-checked`, focus ring, y estado disabled. Disponible en el proyecto aunque actualmente no se usa directamente (la Mejora 3 usa un Button + Modal en lugar de un toggle simple por seguridad).

### 8.8 EmptyState (`EmptyState.tsx`)

**Componente servidor**. Estado vacio reutilizable con icono + titulo + descripcion + CTA opcional.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `icon` | `LucideIcon` | Componente de icono Lucide |
| `title` | `string` | Titulo breve |
| `description` | `string?` | Texto secundario |
| `cta` | `ReactNode?` | Boton o elemento de accion |
| `size` | `"sm" \| "md"` | Tamaño (default `md`) |

**Usado en:** FavoriteRepos (sin favoritos), RecentActivity (sin actividad), TokensPage (sin tokens), SSHKeysPage (sin keys).

### 8.9 SecurityGate (`SecurityGate.tsx`)

**Componente cliente**. Gate de proteccion a nivel de pagina: bloquea el contenido sensible hasta que el usuario confirme su contraseña, **incluso si llega por URL directa** o bookmark.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `children` | `ReactNode` | Contenido protegido |
| `title` | `string?` | Titulo del modal (default `"Confirm access"`) |
| `description` | `string?` | Texto explicativo del modal |

**Como funciona:**

1. Consume `useSecurity()` para leer `isVerified` (TTL global gestionado por `SecurityContext`).
2. Si `isVerified === true`: muestra un badge verde `ShieldCheck · Sesion verificada · expira en N min` arriba del contenido, y renderiza `children`.
3. Si `isVerified === false`: renderiza el contenido en `opacity-20 blur-sm pointer-events-none` (preview "borroso" para mantener contexto) + un overlay modal `role="dialog" aria-modal="true"` con input de password, loading state (`Loader2 animate-spin`), error state (mensaje rojo con `role="alert"`), y boton de confirmacion.
4. Al verificar, llama a `verify(password)` del contexto. Si retorna `true`, el componente re-renderiza con `children` visibles (sin recargar la pagina).

**Usado en:** `app/settings/tokens/page.tsx` (titulo: *"Access Tokens protegidos"*), `app/settings/ssh-keys/page.tsx` (titulo: *"SSH Keys protegidas"*).

**Mock:** cualquier contraseña no vacia es valida (no hay backend). En produccion, `verify()` haria una llamada al servidor de auth.

---

## 9. Componentes de Layout

### 9.1 Navbar (`src/components/layout/Navbar.tsx`)

**Componente cliente** (usa `usePathname()` de Next.js).

La barra de navegacion superior presente en todas las paginas. Replica la estructura de la navbar de GitHub.

**Estructura visual (izquierda a derecha):**

1. **Logo de GitHub** (SVG del Octocat): Link a `/`
2. **Barra de busqueda**: Input con icono de lupa y placeholder "Type / to search" (visual, no funcional)
3. **Links de navegacion**: Dashboard, Repository, Settings
   - El link activo se destaca con fondo `gh-btn-bg` y texto blanco
   - Determinado comparando `pathname` con cada `href`
4. **Campana de notificaciones**: Con indicador azul (punto)
5. **Boton de crear** (+): Con chevron desplegable (visual)
6. **Avatar de usuario**: Con chevron desplegable, link a `/settings`

**Dependencias:**
- Importa `currentUser` de `data/users.ts`
- Usa `Avatar` de `components/ui/Avatar`
- Usa iconos `Search`, `Bell`, `Plus`, `ChevronDown` de `lucide-react`

### 9.2 Root Layout (`src/app/layout.tsx`)

Layout raiz de la aplicacion que envuelve todas las paginas.

**Estructura:**
```
<html lang="es">
  <body>
    <Navbar />              ← Siempre visible
    <main>                  ← Contenedor max-w-7xl centrado, px-4 py-6
      {children}            ← Contenido de la pagina
    </main>
  </body>
</html>
```

**Metadata:**
- Titulo: "GitHub UX Improved"
- Descripcion: "GitHub clone with UX improvements - Proyecto Interfaces"

### 9.3 Settings Layout (`src/app/settings/layout.tsx`)

Layout anidado para las paginas de configuracion. Agrega un sidebar a la izquierda.

**Estructura:**
```
<div className="flex gap-8">
  <SettingsSidebar />       ← Sidebar fijo 224px
  <div className="flex-1">
    {children}              ← Pagina de settings activa
  </div>
</div>
```

### 9.4 SettingsSidebar (`src/components/settings/SettingsSidebar.tsx`)

**Componente cliente** (usa `usePathname()`, consume `SecurityContext`).

Sidebar de navegacion para las paginas de settings. Implementa la **Mejora 2** al poner Tokens y SSH Keys como items prominentes.

**Items del menu:**

| Label | Icono | Ruta | Destacado | Protegido |
|-------|-------|------|-----------|-----------|
| Profile | `User` | `/settings` | No | No |
| Access Tokens | `Key` | `/settings/tokens` | Si (badge "Quick", color azul) | Si |
| SSH Keys | `Shield` | `/settings/ssh-keys` | Si (badge "Quick", color azul) | Si |

Las entradas placeholder (`Appearance`, `Accessibility`, `Notifications`) fueron removidas para cumplir el requisito "navegable de punta a punta sin callejones sin salida".

**Comportamiento de los items protegidos:**

1. Si `useSecurity().isVerified === false`: al hacer click se abre un `Modal` que pide la contraseña. Al verificar correctamente (cualquier contraseña no vacia es valida en el mock) se llama a `verify()` del contexto, que setea `verifiedUntil = Date.now() + 30 min` en `localStorage`, y se navega a la ruta.
2. Si `useSecurity().isVerified === true`: el modal se salta y se navega directo. Un badge verde `ShieldCheck · Verificado · N min` aparece en el sidebar indicando cuanto tiempo queda de sesion verificada.
3. **Importante:** la verificacion tambien se aplica si el usuario llega por URL directa (`http://localhost:3000/settings/tokens`); el `SecurityGate` (seccion 8.8) bloquea el contenido de la pagina.

**Elementos especiales:**
- Los items destacados tienen texto azul (`text-gh-accent`) cuando no estan activos y un badge "Quick"
- El item activo tiene fondo `gh-btn-bg`, texto blanco, y un border lateral azul de 2px
- `<aside>` callout explica la decision de diseño: *"Frecuencia sobre completitud"*

---

## 10. Vista 1: Home Dashboard - Mejora 1

**Ruta:** `/`
**Archivo:** `src/app/page.tsx`
**Tipo:** Server Component (no tiene `"use client"`)

### Problema que resuelve

La pagina de inicio de GitHub muestra un feed social (actividad de repos seguidos) que no es util para el trabajo diario de un estudiante. Los repos mas usados y PRs recientes no estan visibles inmediatamente.

### Estructura de la pagina

```
┌──────────────────────────────────────────────────┐
│  ┌─────────┐  ┌──────────────────────────────┐   │
│  │ Sidebar │  │  Quick Actions (4 botones)   │   │
│  │         │  ├──────────────────────────────┤   │
│  │ Avatar  │  │  Favorite Repos (grid 2col)  │   │
│  │ Nombre  │  ├──────────────────────────────┤   │
│  │ Bio     │  │  Most Used Repos (lista)     │   │
│  │         │  ├──────────────────────────────┤   │
│  │ Repos:  │  │  Recent Pull Requests        │   │
│  │ - repo1 │  │                              │   │
│  │ - repo2 │  │                              │   │
│  │ - ...   │  │                              │   │
│  └─────────┘  └──────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### Componentes y relaciones

#### Sidebar izquierdo (inline en page.tsx)
- **Ancho fijo:** 256px
- **Contenido:** Avatar (lg), nombre, username, bio del `currentUser`
- **Lista de repos:** Todos los repositorios de `data/repos.ts`, cada uno con icono `Book` y link a `/:owner/:name`

#### QuickActions (`src/components/home/QuickActions.tsx`)
- 4 acciones en grid responsive (2-4 columnas)
- Cada accion es un `Link` con icono y label
- "Settings" enlaza a `/settings`; los demas son placeholders (`href="#"`)

#### FavoriteRepos (`src/components/home/FavoriteRepos.tsx`)

| Prop | Tipo | Fuente |
|------|------|--------|
| `repos` | `Repository[]` | `data/repos.ts` |

- Filtra repos donde `isFavorite === true`
- Renderiza un grid de `Card` con: nombre del repo (link azul), badge de visibilidad, descripcion (2 lineas max), lenguaje y estrellas
- Icono de estrella amarilla en el titulo de la seccion

#### MostUsedRepos (`src/components/home/MostUsedRepos.tsx`)

| Prop | Tipo | Fuente |
|------|------|--------|
| `repos` | `Repository[]` | `data/repos.ts` |

- Ordena todos los repos por `lastAccessed` descendente
- Toma los primeros 5
- Lista con: icono de visibilidad, nombre (link), descripcion, lenguaje, estrellas, "Last used X ago"

#### RecentActivity (`src/components/home/RecentActivity.tsx`)

| Prop | Tipo | Fuente |
|------|------|--------|
| `pullRequests` | `PullRequest[]` | `data/pullRequests.ts` |

- Muestra todos los PRs de todos los repos
- Cada fila: icono de PR coloreado por estado, titulo (link a PR), metadata, badge de estado, tiempo relativo

### Flujo de datos

```
data/repos.ts ─────────┬──→ FavoriteRepos (filtra isFavorite)
                       ├──→ MostUsedRepos (ordena por lastAccessed)
                       └──→ Sidebar (lista todos)

data/pullRequests.ts ──→ RecentActivity (muestra todos)
data/users.ts ─────────→ Sidebar (currentUser avatar, nombre, bio)
```

---

## 11. Vista 2: Settings - Mejora 2

**Rutas:** `/settings`, `/settings/tokens`, `/settings/ssh-keys`

### Problema que resuelve

En GitHub real, los Personal Access Tokens estan en Settings > Developer Settings > Personal access tokens (3 niveles de profundidad). Las SSH keys estan en otra seccion. Para un estudiante que necesita configurar autenticacion rapidamente, esto genera confusion y perdida de tiempo.

### Pagina principal (`/settings`)

**Archivo:** `src/app/settings/page.tsx`
**Tipo:** Server Component

**Estructura:**
- Titulo "Profile Settings"
- Card con avatar y datos del usuario actual
- Grid de 2 cards de acceso rapido:
  - **Access Tokens**: Icono Key, descripcion, conteo de tokens activos (verde), link a `/settings/tokens`
  - **SSH Keys**: Icono Shield, descripcion, conteo de keys, link a `/settings/ssh-keys`

### Proteccion de rutas sensibles: SecurityGate

Las rutas `/settings/tokens` y `/settings/ssh-keys` estan **envueltas en `<SecurityGate>`** (ver seccion 8.9). El gate consulta `SecurityContext` para determinar si la sesion esta verificada:

- **Por URL directa** (`http://localhost:3000/settings/tokens` en una pestaña nueva, bookmark, link compartido): el contenido se renderiza borroso (`opacity-20 blur-sm`) y aparece un modal pidiendo contraseña.
- **Por click desde el sidebar**: si ya hay sesion verificada, el sidebar salta el prompt y navega directo. Si no, abre su propio modal de password (con la misma logica) antes de navegar.
- **TTL de la verificacion**: 30 minutos, persistido en `localStorage` (clave `gh-security-verified-until` con timestamp epoch ms). Un `setInterval` de 5s en `SecurityContext` re-valida `Date.now() > verifiedUntil` para invalidar automaticamente.

El mock acepta cualquier contraseña no vacia (es UX puro; no hay backend de auth).

### Pagina de Tokens (`/settings/tokens`)

**Archivo:** `src/app/settings/tokens/page.tsx`
**Tipo:** Client Component (`"use client"`)
**Proteccion:** envuelta en `<SecurityGate title="Access Tokens protegidos" description="..." >`.

**Estado local:**

| Estado | Tipo | Inicial | Proposito |
|--------|------|---------|-----------|
| `tokens` | `PersonalAccessToken[]` | `data/tokens.ts` | Lista mutable de tokens |
| `showModal` | `boolean` | `false` | Visibilidad del modal de creacion |
| `newTokenName` | `string` | `""` | Input del nombre del nuevo token |
| `selectedScopes` | `string[]` | `[]` | Scopes seleccionados |
| `error` | `string \| null` | `null` | Mensaje de validacion inline |
| `submitting` | `boolean` | `false` | Loading state durante creacion |
| `copied` | `string \| null` | `null` | Id del token cuyo preview se copio recientemente |

**Funcionalidades:**
- **Ver tokens**: Lista con nombre, preview enmascarado, badges de scopes, fechas de creacion/expiracion, boton copiar (con feedback `Check` por 1.5s)
- **Crear token**: Modal con validacion inline (nombre obligatorio, formato `[a-zA-Z0-9._-]+`, scopes minimo 1, no duplicados), loading state simulado (`setTimeout 800ms`) y `Loader2 animate-spin` en el boton
- **Eliminar token**: Boton rojo (Trash2) que filtra el token del estado
- **Empty state**: si la lista esta vacia, muestra `<EmptyState>` con CTA "Generate your first token"

**Componentes usados:** Button, Badge, Modal, EmptyState, SecurityGate, Key/Trash2/Plus/Copy/Loader2/Check (iconos).

### Pagina de SSH Keys (`/settings/ssh-keys`)

**Archivo:** `src/app/settings/ssh-keys/page.tsx`
**Tipo:** Client Component (`"use client"`)
**Proteccion:** envuelta en `<SecurityGate title="SSH Keys protegidas" description="..." >`.

**Estado local:**

| Estado | Tipo | Inicial | Proposito |
|--------|------|---------|-----------|
| `keys` | `SSHKey[]` | `data/sshKeys.ts` | Lista mutable de SSH keys |
| `showModal` | `boolean` | `false` | Visibilidad del modal |
| `newTitle` | `string` | `""` | Titulo de la nueva key |
| `newKey` | `string` | `""` | Clave publica (textarea) |
| `error` | `string \| null` | `null` | Mensaje de validacion inline |
| `submitting` | `boolean` | `false` | Loading state durante creacion |

**Funcionalidades:**
- **Ver keys**: Lista con titulo, fingerprint SHA256, fechas, boton eliminar
- **Agregar key**: Modal con validacion (titulo obligatorio, clave debe empezar con uno de `ssh-rsa`, `ssh-ed25519`, `ssh-dss`, `ecdsa-sha2-nistp{256,384,521}`) + loading state (`Loader2 animate-spin`)
- **Eliminar key**: Boton rojo que filtra la key del estado
- **Empty state**: si no hay keys, muestra `<EmptyState>` con CTA "Add your first SSH key"

### Flujo de datos

```
data/tokens.ts ──→ useState (tokens) ──→ Lista de tokens
                                       ──→ Crear → agrega al estado
                                       ──→ Eliminar → filtra del estado

data/sshKeys.ts ──→ useState (keys) ──→ Lista de keys
                                      ──→ Agregar → agrega al estado
                                      ──→ Eliminar → filtra del estado
```

---

## 12. Vista 3: Repositorio - Mejoras 3 y 4

**Ruta:** `/:user/:repo` (e.g., `/javier-lopez/proyecto-interfaces`)
**Archivo:** `src/app/[user]/[repo]/page.tsx`
**Tipo:** Client Component

### Problema que resuelve

**Mejora 3:** En GitHub real, cambiar la visibilidad de un repo requiere navegar a Settings > General > Danger Zone. Esto es poco intuitivo y esta escondido.

**Mejora 4:** No existe forma nativa de descargar una carpeta especifica de un repo sin clonar todo el repositorio.

### Parametros de ruta

```typescript
const params = useParams();
const repoName = params.repo as string;   // e.g., "proyecto-interfaces"
const userName = params.user as string;    // e.g., "javier-lopez"
```

Se busca el repositorio en `data/repos.ts` y los archivos en `data/files.ts`. Si no se encuentra, se muestra un mensaje de "Repository not found".

### Estado local

| Estado | Tipo | Proposito |
|--------|------|-----------|
| `activeTab` | `string` | Tab activa ("code", "issues", "pulls", "actions") |

### Estructura de la pagina

```
┌──────────────────────────────────────────────────┐
│  RepoHeader                                       │
│  owner/name  [Public] [Make private]  [Star] [Fork]│
├──────────────────────────────────────────────────┤
│  [Code]  [Issues 3]  [Pull Requests 2]  [Actions] │
├──────────────────────────────────────────────────┤
│  Tab content:                                     │
│  - Code → FileBrowser + ReadmePreview             │
│  - Pulls → Lista de PRs del repo                  │
│  - Issues/Actions → Placeholder                   │
└──────────────────────────────────────────────────┘
```

### Componentes

#### RepoHeader (`src/components/repo/RepoHeader.tsx`)

**Componente cliente** — implementa la **Mejora 3**.

| Prop | Tipo |
|------|------|
| `repo` | `Repository` |

**Estado local:**

| Estado | Tipo | Proposito |
|--------|------|-----------|
| `visibility` | `"public" \| "private"` | Visibilidad actual (mutable) |
| `showConfirm` | `boolean` | Modal de confirmacion |
| `starred` | `boolean` | Estado de estrella |

**Elementos visuales:**
- Nombre del repo con formato `owner/name`
- Badge de visibilidad (icono candado o globo)
- **Boton "Make private" / "Make public"** (Mejora 3): Al hacer clic, abre un modal de confirmacion con advertencia contextual. Al confirmar, cambia el estado local.
- Botones Star (con contador que incrementa), Fork (con contador), Watch
- Descripcion del repo
- Callout azul explicando la mejora UX

#### FileBrowser (`src/components/repo/FileBrowser.tsx`)

**Componente cliente** — implementa la **Mejora 4**.

| Prop | Tipo |
|------|------|
| `files` | `FileEntry[]` |

**Estado local:**

| Estado | Tipo | Proposito |
|--------|------|-----------|
| `toast` | `string \| null` | Mensaje de toast de descarga |

**Elementos visuales:**
- **Selector de branch**: Boton "main" con icono GitBranch (visual)
- **Boton "Code"**: Boton primario verde con icono Download (visual)
- **Tabla de archivos**: Header con info del ultimo commit
- Cada fila (`FileRow`):
  - Icono carpeta (azul) o archivo (gris)
  - Nombre
  - **Boton de descarga en carpetas** (Mejora 4): Aparece con `opacity-0 group-hover:opacity-100` al pasar el mouse. Al hacer clic, muestra un toast "Downloading [folder]/ as ZIP..." que desaparece despues de 3 segundos.
  - Mensaje del ultimo commit
  - Tiempo relativo

Los archivos se ordenan: carpetas primero, luego archivos, ambos alfabeticamente.

#### ReadmePreview (`src/components/repo/ReadmePreview.tsx`)

| Prop | Tipo |
|------|------|
| `repoName` | `string` |

Renderiza un README hardcodeado con HTML estilizado (sin parser de Markdown). Contiene:
- Titulo con nombre del repo
- Descripcion del proyecto
- Lista de las 5 mejoras UX
- Seccion "Getting Started" con bloque de codigo
- Seccion "Tech Stack"

### Flujo de datos

```
URL params ([user], [repo])
    │
    ├──→ data/repos.ts ──→ find() ──→ RepoHeader (repo data)
    ├──→ data/files.ts ──→ lookup ──→ FileBrowser (file tree)
    └──→ data/pullRequests.ts ──→ filter() ──→ PR list (tab "pulls")
```

---

## 13. Vista 4: Pull Request - Mejora 5

**Ruta:** `/:user/:repo/pull/:id` (e.g., `/javier-lopez/proyecto-interfaces/pull/1`)
**Archivo:** `src/app/[user]/[repo]/pull/[id]/page.tsx`
**Tipo:** Client Component

### Problema que resuelve

En GitHub real:
- La direccion del merge se muestra como texto pequeno facilmente pasado por alto
- El progreso de revision esta disperso entre la barra lateral y la conversacion
- Con multiples commits, el diff puede ser confuso

### Parametros de ruta

```typescript
const prId = Number(params.id);
const repoName = params.repo as string;
const userName = params.user as string;
```

Se busca el PR en `data/pullRequests.ts` filtrando por `id`, `repoName` y `repoOwner`.

### Estado local

| Estado | Tipo | Proposito |
|--------|------|-----------|
| `activeTab` | `string` | Tab activa ("conversation", "commits", "files") |

### Estructura de la pagina

```
┌──────────────────────────────────────────────────────────┐
│  Breadcrumb: owner/repo / Pull Request #1                 │
├──────────────────────────────────────────────────────────┤
│  PR Header: [icon] Title #id                              │
│  [Open/Merged/Closed]  author opened X ago                │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐    │
│  │  MergeDirectionBanner                             │    │
│  │  feature/settings-redesign  ────→  main           │    │
│  └──────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌──────────────────┐      │
│  │ Main Content (flex-1)    │  │ Sidebar (288px)   │      │
│  │                          │  │                   │      │
│  │ [Conversation] [Commits] │  │ ReviewProgressBar │      │
│  │ [Files Changed]          │  │ ┌───────────────┐│      │
│  │                          │  │ │ 2/3 reviewed  ││      │
│  │ Tab content:             │  │ │ [=======   ]  ││      │
│  │ - Conversation:          │  │ │ maria ✓      ││      │
│  │   PR body + Timeline     │  │ │ carlos ✗     ││      │
│  │   + Merge button         │  │ │ ana ⏳        ││      │
│  │ - Commits:               │  │ └───────────────┘│      │
│  │   CommitList             │  │                   │      │
│  │ - Files:                 │  │ Labels            │      │
│  │   DiffViewer             │  │ Linked Issues     │      │
│  └──────────────────────────┘  └──────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### Componentes

#### MergeDirectionBanner (`src/components/pr/MergeDirectionBanner.tsx`)

Elemento visual principal de la **Mejora 5**.

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `headBranch` | `string` | Rama origen |
| `baseBranch` | `string` | Rama destino |
| `status` | `"open" \| "merged" \| "closed"` | Estado del PR (afecta color del borde) |

**Visual:**
```
         Wants to merge into main from feature/settings-redesign

  ┌─────────────────────────┐         ┌──────────────┐
  │ 🌿 feature/settings-... │ ───→──→ │ 🌿 main      │
  │     (azul)              │         │    (verde)    │
  └─────────────────────────┘         └──────────────┘
```

- La rama head se muestra con fondo y borde azul (accent)
- La rama base se muestra con fondo y borde verde (success)
- Una flecha conecta ambas visualmente
- El borde exterior del banner cambia segun el estado del PR
- Callout al pie explicando la mejora

#### ReviewProgressBar (`src/components/pr/ReviewProgressBar.tsx`)

Segundo elemento clave de la **Mejora 5**.

| Prop | Tipo |
|------|------|
| `reviewers` | `Reviewer[]` |

**Funcionalidad:**
- Calcula porcentaje de reviewers que respondieron (status != "pending")
- Muestra barra de progreso verde proporcional
- Lista cada reviewer con:
  - Avatar (busca en `collaborators` y `currentUser`)
  - Username
  - Icono y label de estado coloreado:
    - `approved` → Check verde, "Approved"
    - `changes_requested` → X rojo, "Changes requested"
    - `pending` → Clock amarillo, "Pending"
    - `commented` → MessageCircle azul, "Commented"

**Funcion auxiliar:**
```typescript
function getUserAvatar(username: string): string
// Busca en currentUser y collaborators, fallback a ui-avatars.com
```

Esta misma funcion se repite en PRTimeline y CommitList (internamente en cada componente).

#### DiffViewer (`src/components/pr/DiffViewer.tsx`)

**Componente cliente.**

| Prop | Tipo |
|------|------|
| `files` | `DiffFile[]` |

**Estructura:**
1. **Resumen**: Cantidad de archivos, total de adiciones (verde) y eliminaciones (rojo)
2. **Por cada archivo** (componente interno `DiffFileView`):
   - Header clickeable para expandir/colapsar (estado local `expanded`)
   - Nombre del archivo, conteo +/-, mini barra visual de cambios
   - Contenido del diff:
     - Header del hunk (fondo azul)
     - Lineas con numeros (columna vieja, columna nueva)
     - Prefijo `+`/`-`/` ` segun tipo
     - Colores de fondo: verde translucido para adiciones, rojo translucido para eliminaciones

#### PRTimeline (`src/components/pr/PRTimeline.tsx`)

| Prop | Tipo |
|------|------|
| `comments` | `PRComment[]` |

Renderiza una lista cronologica de comentarios y reviews. Cada entrada tiene:
- Avatar del autor
- Header con icono segun tipo (CheckCircle verde para review, MessageCircle azul para comment, AlertCircle gris para system)
- Nombre del autor, tipo de accion, timestamp relativo
- Cuerpo del comentario

#### CommitList (`src/components/pr/CommitList.tsx`)

| Prop | Tipo |
|------|------|
| `commits` | `Commit[]` |

Lista de commits del PR. Cada fila:
- Icono GitCommit
- Avatar del autor
- Mensaje del commit
- "committed X ago"
- SHA en formato monospace azul con boton de copiar

### Tab "Conversation" (contenido adicional en page.tsx)

Ademas de PRTimeline, la tab de Conversation incluye:
- **Cuerpo del PR**: Card con avatar del autor, header y cuerpo formateado (`whitespace-pre-wrap`)
- **Boton de merge** (solo si status === "open"): Card con mensaje "This branch has no conflicts" y boton verde "Merge pull request"

### Flujo de datos

```
URL params ([user], [repo], [id])
    │
    └──→ data/pullRequests.ts ──→ find()
              │
              ├──→ PR header (title, status, author, createdAt)
              ├──→ MergeDirectionBanner (headBranch, baseBranch, status)
              ├──→ ReviewProgressBar (reviewers[])
              ├──→ PRTimeline (comments[])
              ├──→ CommitList (commits[])
              └──→ DiffViewer (diffFiles[])

data/users.ts ──→ getUserAvatar() en ReviewProgressBar, PRTimeline, CommitList
```

---

## 14. Flujo de Datos y Relaciones entre Componentes

### Diagrama general de dependencias

```
                    ┌─────────────┐
                    │ types/      │
                    │ index.ts    │
                    └──────┬──────┘
                           │ (importado por todos)
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ data/    │ │ lib/     │ │ comp/ui/ │
        │ *.ts     │ │ utils.ts │ │ *.tsx    │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │            │
             │ (datos)     │ (helpers)  │ (primitivos)
             ▼             ▼            ▼
    ┌─────────────────────────────────────────┐
    │ Componentes de dominio                   │
    │ (home/, settings/, repo/, pr/, layout/)  │
    └──────────────────┬──────────────────────┘
                       │ consume / propaga state
                       ▼
              ┌─────────────────┐         ┌──────────────────┐
              │ context/        │◄────────│ localStorage     │
              │ providers       │         │ (browser API)    │
              └────────┬────────┘         └──────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Paginas (app/)  │
              │ page.tsx files  │
              └─────────────────┘
```

### Patron de datos

1. **Datos estaticos** (`data/*.ts`) → importados directamente por paginas
2. **Estado mutable local** → `useState` a nivel de pagina o componente, inicializado desde datos estaticos (formularios, modales, tabs activos)
3. **Estado global** → `Context API` (`FavoritesContext`, `VisibilityContext`, `SecurityContext`) persistido en `localStorage`
4. **Props drilling** → las paginas pasan datos a sus componentes hijos via props para todo lo que no es estado global

### Relacion componentes UI ← Componentes de dominio

| Componente UI | Usado por |
|---------------|-----------|
| `Avatar` | Navbar, Home sidebar, Settings, PRTimeline, CommitList, ReviewProgressBar, PR header |
| `Badge` | RecentActivity, RepoHeader, Repo PR list, PR page, Token scopes, PR labels |
| `Button` | Settings (crear/eliminar), RepoHeader (star/fork/visibility), FileBrowser, PR page (merge), Modals, QuickActions |
| `Card` | FavoriteRepos, Settings overview |
| `EmptyState` | FavoriteRepos, RecentActivity, TokensPage, SSHKeysPage, FileBrowser (carpeta vacia) |
| `Modal` | Tokens (crear), SSH Keys (agregar), RepoHeader (confirmar visibilidad), QuickActions (New Repo / New PR), SettingsSidebar (password) |
| `SecurityGate` | TokensPage, SSHKeysPage |
| `Tabs` | Repo page, PR page |
| `Toggle` | Disponible pero no usado directamente (el toggle de visibilidad usa Button + Modal) |

---

## 15. Rutas de la Aplicacion

| Ruta | Archivo | Tipo | Protegida | Descripcion |
|------|---------|------|-----------|-------------|
| `/` | `app/page.tsx` | Server | — | Home Dashboard (Mejora 1) |
| `/explore` | `app/explore/page.tsx` | Server | — | Trending y tus repositorios |
| `/settings` | `app/settings/page.tsx` | Server | — | Perfil + acceso rapido a tokens/keys |
| `/settings/tokens` | `app/settings/tokens/page.tsx` | Client | **Si** (SecurityGate) | Gestion de tokens (Mejora 2) |
| `/settings/ssh-keys` | `app/settings/ssh-keys/page.tsx` | Client | **Si** (SecurityGate) | Gestion de SSH keys (Mejora 2) |
| `/:user/:repo` | `app/[user]/[repo]/page.tsx` | Client | — | Vista de repositorio (Mejoras 3, 4) |
| `/:user/:repo/pull/:id` | `app/[user]/[repo]/pull/[id]/page.tsx` | Client | — | Vista de PR (Mejora 5) |

Las rutas marcadas como **protegidas** requieren confirmacion de password (modal del `SecurityGate`) tanto si se accede por click desde el sidebar como por URL directa. La verificacion dura 30 minutos via `SecurityContext` (ver seccion 16).

### Rutas con datos mock disponibles

- `/javier-lopez/proyecto-interfaces` — Repo con archivos, PRs, y todos los features
- `/javier-lopez/algoritmos-avanzados` — Repo con PR #3
- `/javier-lopez/api-rest-tareas` — Repo sin PRs
- `/javier-lopez/notas-privadas` — Repo privado
- `/javier-lopez/dotfiles` — Repo publico
- `/javier-lopez/ml-clasificador` — Repo privado favorito
- `/javier-lopez/proyecto-interfaces/pull/1` — PR abierto con diffs completos
- `/javier-lopez/proyecto-interfaces/pull/2` — PR merged

---

## 16. Decisiones Tecnicas

### Solo tema oscuro

Se implemento unicamente el tema oscuro de GitHub. Razones:
- Reduce la complejidad a la mitad (sin variables de tema dual)
- El tema oscuro es mas impactante visualmente en una presentacion
- La mayoria de desarrolladores usan tema oscuro

### Frontend-only con datos hardcodeados

- No hay backend, base de datos ni llamadas a APIs
- Los datos iniciales se importan directamente como constantes TypeScript desde `src/data/`
- Las modificaciones efimeras (crear token, agregar SSH key) usan `useState` local y se pierden al recargar; las modificaciones globales (marcar favoritos, cambiar visibilidad de un repo, verificar sesion) se persisten en `localStorage` via Context (ver seccion siguiente)
- Las acciones que en produccion irian a un servidor se simulan con `setTimeout` para mostrar transiciones loading → success en la UI

### App Router de Next.js

- Se usa el App Router (directorio `app/`) en lugar del Pages Router legacy
- Layouts anidados para Settings permiten mantener el sidebar sin re-renderizar
- Rutas dinamicas (`[user]`, `[repo]`, `[id]`) se leen con `useParams()`

### Componentes Server vs Client

- **Server Components** (default): Home page, Settings overview — no necesitan interactividad
- **Client Components** (`"use client"`): Todo lo que usa `useState`, `usePathname`, `useParams`, u onClick handlers

### Iconos con lucide-react

Se eligio `lucide-react` sobre `@primer/octicons-react` (los iconos oficiales de GitHub) por:
- Licencia MIT sin ambiguedad
- API mas simple (`<Icon className="..." />`)
- Tree-shakeable (solo se importan los iconos usados)
- Apariencia visual muy similar a los Octicons

### Sin libreria de Markdown

El `ReadmePreview` usa HTML hardcodeado con clases de Tailwind en lugar de un parser como `react-markdown`. Para un prototipo, agregar una dependencia extra para parsear Markdown no agrega valor demostrativo.

### Estado global con Context + localStorage

El proyecto usa **tres React Contexts** (en `src/context/`) para estado que necesita sobrevivir navegacion. Toda la persistencia es en `localStorage` (no sessionStorage, no backend). Los providers se anidan en `src/app/layout.tsx`.

| Context | Clave localStorage | Persiste | Consumido por |
|---------|--------------------|----------|---------------|
| `FavoritesContext` | `gh-favorites` | Set de `"owner/name"` | `FavoriteRepos`, `MostUsedRepos`, `RepoHeader` |
| `VisibilityContext` | `gh-visibility` | Map de visibilidad por repo | `FavoriteRepos`, `MostUsedRepos`, `RepoHeader` |
| `SecurityContext` | `gh-security-verified-until` | Timestamp epoch ms hasta cuando dura la sesion verificada (TTL 30 min) | `SecurityGate`, `SettingsSidebar` |

Justificacion: el estado global es minimo (3 contextos pequeños), por lo que **no introdujimos Redux ni Zustand**. Context API es suficiente y no agrega dependencias.

**Por que `localStorage` y no `sessionStorage`:** queremos que los favoritos y la visibilidad sobrevivan al cierre del navegador. Para la verificacion de seguridad, `localStorage` se combina con un timestamp TTL (30 min) que el contexto re-evalua cada 5s, replicando el comportamiento "sudo" de GitHub real (verificas una vez y dura un rato, no toda la vida).

### Proteccion de rutas sin backend

Las rutas que muestran credenciales (`/settings/tokens`, `/settings/ssh-keys`) estan envueltas en `<SecurityGate>` (`src/components/ui/SecurityGate.tsx`). Esto impide que un usuario acceda al contenido por URL directa o bookmark sin pasar por el modal de password. El gate consume `SecurityContext`, por lo que **la verificacion realizada desde el sidebar tambien aplica al gate de ruta** (y viceversa).
