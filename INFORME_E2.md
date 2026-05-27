# Informe Entrega 2 — Implementación Frontend

**Curso:** IIC2182 — Interfaces y Experiencia de Usuario
**Pontificia Universidad Católica de Chile**
**Proyecto:** DevHub — Una capa de UX sobre GitHub para desarrolladores novatos
**Equipo:** _[nombres del equipo]_
**Fecha:** 26 de mayo de 2026

---

## 1. Contexto y reframe del problema

### 1.1 De los síntomas a la causa

En la Entrega 1 identificamos cinco puntos de fricción específicos en GitHub a partir de entrevistas con estudiantes de computación y desarrolladores junior: tokens de acceso enterrados en *Developer Settings*, descarga de repositorios "todo o nada", PRs comunicados como timeline abstracto, configuraciones repartidas entre menús poco lógicos, y una landing page que no refleja el estado real del usuario.

El feedback que recibimos sobre esa entrega fue contundente y, en retrospectiva, justo: **nos quedamos con los síntomas, no diagnosticamos la enfermedad**. La metáfora que se nos planteó fue clara: un paciente con fiebre y tos no tiene como diagnóstico "fiebre y tos"; tiene una infección que se manifiesta como esos síntomas. Nuestra propuesta de E1 era, en ese marco, "antitusivos y baños fríos" — soluciones inconexas a problemas superficiales.

Volvimos al material de E1 (entrevistas, VPC, User Persona) y nos preguntamos: **¿qué tienen en común estos cinco síntomas?** La respuesta nos permitió formular un diagnóstico de fondo.

### 1.2 Diagnóstico de fondo

> **GitHub organiza su interfaz alrededor de _entidades del sistema_ (repos, branches, settings, organizations) y no alrededor de _intenciones del usuario_ (autenticarme, colaborar, revisar, compartir un fragmento).** Esa organización funciona para mantenedores experimentados que ya internalizaron el modelo mental de la plataforma, pero **penaliza al desarrollador novato y al estudiante de computación**, que necesita primero entender *qué quiere hacer* y luego encontrar dónde se hace. Los cinco síntomas comparten una misma raíz: la información está ordenada por la lógica interna del producto, no por la frecuencia ni la intención de uso del usuario real.

### 1.3 Producto concreto

DevHub no es "GitHub con cinco botones movidos". Es **una capa de UX que aplica un principio único — _intención sobre entidad, frecuencia sobre completitud_ — a las decisiones de organización, jerarquía y disclosure de la interfaz**. Cada una de las cinco features ahora se entiende como una instancia de ese principio:

| Síntoma (E1) | Reframe (E2) | Principio aplicado |
|---|---|---|
| Home dashboard pobre | Landing como "espacio de trabajo del día" | Intención sobre entidad |
| Tokens en *Developer Settings* | Credenciales frecuentes en primer nivel | Frecuencia sobre completitud |
| Visibilidad en *Danger Zone* | Acción común inline en el header | Frecuencia sobre completitud |
| Descarga "todo o nada" | Granularidad alineada con la tarea | Intención sobre entidad |
| PR como timeline | PR como proceso visual con dirección y avance | Modelo mental explícito |

Este reframe no quedó sólo en el informe: lo materializamos visualmente en la propia UI mediante callouts contextuales (`<aside>` con el label *"Frecuencia sobre completitud"*, *"Modelo mental explícito"*, *"Proceso visible"*) que aparecen junto a cada decisión de diseño y explican por qué tomamos esa decisión. Esto cierra el lazo entre diagnóstico, diseño y código.

---

## 2. Pains y gains resueltos

A continuación detallamos las cinco features resueltas. Cada una se presenta como un dolor heredado de E1, su diagnóstico de fondo, la decisión de producto, la decisión de diseño y su implementación.

### 2.1 Home como espacio de trabajo personalizado

- **Pain heredado:** Javier López (estudiante de computación) abre GitHub y aterriza en una landing genérica que no refleja en qué está trabajando hoy. Pierde tiempo navegando entre repos para encontrar lo relevante.
- **Diagnóstico de fondo:** la home actual responde a "¿qué entidades hay?", no a "¿qué intenciones tienes hoy?". *Intención sobre entidad.*
- **Decisión de producto:** un dashboard de cuatro bloques organizados por intención: **Quick Actions** (qué quiero hacer), **Favorite Repositories** (qué me importa), **Most Used Repositories** (en qué estoy trabajando) y **Recent Pull Requests** (qué requiere mi atención).
- **Decisión de diseño:** aplicamos **Gestalt de similitud** — las tres secciones de repos/PRs comparten layout interno consistente (icono + título a la izquierda, metadata a la derecha) para señalar que son "filtros del mismo tipo de información". La proximidad separa secciones con `space-y-8`, y los Quick Actions usan un grid de cards iguales (similitud máxima) para que se lean como un conjunto homogéneo.
- **Implementación:** `src/app/page.tsx`, componentes `src/components/home/{QuickActions,FavoriteRepos,MostUsedRepos,RecentActivity}.tsx`. Quick Actions abre modales reales para "New Repository" y "New Pull Request" (no más `href="#"`).

_📸 Captura: pantalla principal con los cuatro bloques y un Quick Action modal abierto._

### 2.2 Credenciales en primer nivel de Settings

- **Pain heredado:** crear un Personal Access Token en GitHub real implica `Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token`. Cinco clics, y el menú "Developer settings" no es donde un estudiante busca su propio token.
- **Diagnóscoto de fondo:** GitHub organiza Settings por *quién consume* la configuración (developer, billing, security), pero el usuario novato organiza mentalmente por *qué necesita configurar*. Para él, "mi token de acceso" no es "developer settings", es "mis credenciales". *Frecuencia sobre completitud.*
- **Decisión de producto:** promovemos **Access Tokens** y **SSH Keys** al primer nivel del sidebar de Settings, con un badge `Quick` que los distingue visualmente. Mantenemos la confirmación con contraseña (no relajamos la seguridad) pero la dejamos detrás de un solo clic. La verificación es a **nivel de ruta**, no de link: si el usuario llega a `/settings/tokens` por URL directa o bookmark, el `<SecurityGate>` también bloquea el contenido.
- **Decisión de diseño:** **jerarquía visual por frecuencia** (entradas más usadas más arriba, con color de acento) + **progressive disclosure** (la contraseña aparece sólo cuando intentas acceder, no en cada navegación). Un callout `<aside>` explica explícitamente el cambio para que el usuario aprenda el modelo mental nuevo. La verificación queda activa por 30 minutos (patrón "sudo mode" de GitHub real), evidenciada con un badge verde `ShieldCheck · Verificado · N min` en el sidebar, para no exigir contraseña entre navegaciones cercanas.
- **Implementación:** `src/components/settings/SettingsSidebar.tsx`, páginas `src/app/settings/tokens/page.tsx` y `src/app/settings/ssh-keys/page.tsx` envueltas en `<SecurityGate>` (`src/components/ui/SecurityGate.tsx`). Estado global de verificación en `src/context/SecurityContext.tsx` con TTL persistido en `localStorage` (clave `gh-security-verified-until`). Ambos formularios tienen loading state (`Loader2 animate-spin`), validación inline de nombre y de formato (debe empezar con `ssh-rsa`/`ssh-ed25519`/...), y empty state cuando no hay tokens/keys.

_📸 Captura: sidebar de Settings con el callout "Frecuencia sobre completitud" + formulario de creación de token en estado loading._

### 2.3 Visibilidad inline en el header del repositorio

- **Pain heredado:** cambiar la visibilidad de un repo en GitHub real está en `Settings → General → Danger Zone`, junto a "Delete repository". Esto agrupa una acción frecuente (cambiar a privado para hacer pruebas) con una acción irreversible (eliminar), generando ansiedad y fricción.
- **Diagnóstico de fondo:** GitHub clasificó la acción por *consecuencia* ("podría exponer código") en lugar de por *frecuencia de uso real* (cambiar visibilidad es común). *Frecuencia sobre completitud.*
- **Decisión de producto:** botón **Make private / Make public** directamente en el header del repo, junto a Star y Fork. Mantenemos un **modal de confirmación** con texto explícito (no es one-click destructivo) para preservar la salvaguarda contra accidentes.
- **Decisión de diseño:** **proximidad** — agrupamos visualmente las acciones del repositorio (visibility, star, fork, watch) porque son todas decisiones del usuario sobre el repo. Color del badge cambia entre `muted` (público) y `warning` (privado) para hacer del estado actual una pieza de información de **alto contraste, no enterrada**. Callout justifica el cambio.
- **Implementación:** `src/components/repo/RepoHeader.tsx`. Persistencia del estado en `VisibilityContext` (localStorage) para que el cambio sobreviva navegación entre rutas y entre sesiones del navegador.

_📸 Captura: header del repo con el botón Make private, badge de visibility, y el callout "Frecuencia sobre completitud"._

### 2.4 Descarga de carpeta específica

- **Pain heredado:** GitHub solo permite "descargar el ZIP de todo el repo". Si necesitas sólo `src/components/` para incluir en tu proyecto, tienes que clonar 200 MB o copiar archivo por archivo.
- **Diagnóstico de fondo:** la granularidad ofrecida ("todo el repo") no se alinea con la granularidad de la tarea real ("este componente"). *Intención sobre entidad.*
- **Decisión de producto:** botón de descarga inline en cada carpeta del file browser, que aparece en hover (no satura visualmente) pero está siempre disponible vía focus para teclado.
- **Decisión de diseño:** **progressive disclosure por hover** — el botón está oculto (`opacity-0`) hasta que el usuario interactúa con la fila (`group-hover:opacity-100`), evitando ruido visual. **focus-visible** lo hace aparecer también vía teclado (accesibilidad). Color del icono cambia de `text-gh-fg-muted` a `text-gh-accent` en hover para confirmar la affordance.
- **Implementación:** `src/components/repo/FileBrowser.tsx`. La descarga es real: generamos un `Blob` con manifest JSON de los archivos contenidos y disparamos un download via `URL.createObjectURL` + `<a download>`. En producción sería un `.zip`; aquí entregamos un manifest funcional que demuestra el flujo completo.

_📸 Captura: file browser con un folder en estado hover mostrando el botón de descarga + toast de confirmación post-descarga._

### 2.5 Pull Request como proceso visual

- **Pain heredado:** el header de un PR en GitHub muestra `feature-branch:main` y un timeline cronológico. Para un estudiante novato, esto no responde a las dos preguntas que realmente importa: *¿hacia dónde va este merge?* y *¿dónde vamos en el proceso de revisión?*
- **Diagnóstico de fondo:** GitHub asume que el modelo mental de git (ramas, merge direction, review states) está internalizado. *Modelo mental explícito sobre implícito.*
- **Decisión de producto:** dos componentes destacados al abrir un PR:
  - **MergeDirectionBanner**: muestra `headBranch → baseBranch` con flecha, etiquetas "Desde / Hacia" y colores semánticos (acento para fuente, verde éxito para destino).
  - **ReviewProgressBar**: barra de progreso global + lista de reviewers con su estado individual (approved/changes_requested/pending/commented) + cobertura por archivo. Visible para todos, no solo para cada reviewer individualmente.
- **Decisión de diseño:** **jerarquía** — el banner ocupa la parte superior con tamaño grande porque responde a la pregunta más urgente ("¿esto va a la rama correcta?"). El review progress vive en sidebar persistente. **Progressive disclosure** en las tabs (Conversation / Commits / Files Changed): muestra primero el resumen agregado, deja el detalle bajo tabs. **Vocabulario visual** consistente: verde = avance/merge, azul = info, rojo = alerta, púrpura = done.
- **Implementación:** `src/components/pr/MergeDirectionBanner.tsx` y `src/components/pr/ReviewProgressBar.tsx`. Página `src/app/[user]/[repo]/pull/[id]/page.tsx`. Estado de "file reviewed" persistido en `useState` local con toggle por archivo.

_📸 Captura: vista de PR con merge banner arriba + tabs + review progress en sidebar._

---

## 3. Style Guide del proyecto

Acuerdo visual mínimo del equipo, contra el que se evalúa la consistencia de la UI implementada.

### 3.1 Paleta de colores

Inspirada en el **dark theme** de GitHub. Todos los colores están definidos como tokens `gh-*` en `tailwind.config.ts`.

| Token | Hex | Uso |
|---|---|---|
| `gh-canvas` | `#0d1117` | Fondo principal de la app |
| `gh-canvas-subtle` | `#161b22` | Fondo de superficies elevadas (cards, modals, navbar) |
| `gh-canvas-inset` | `#010409` | Fondo de elementos profundos (code blocks) |
| `gh-border` | `#30363d` | Bordes y separadores |
| `gh-fg` | `#e6edf3` | Texto principal |
| `gh-fg-muted` | `#848d97` | Texto secundario, captions, metadata |
| `gh-accent` | `#58a6ff` | Énfasis, links, focus rings |
| `gh-success` | `#3fb950` | Estados de éxito, merge, branch base |
| `gh-danger` | `#f85149` | Errores, acciones destructivas |
| `gh-warning` | `#d29922` | Advertencias, repos privados |
| `gh-done` | `#a371f7` | PRs merged, estados de completitud |
| `gh-btn-primary` | `#238636` | Botones primarios (acción positiva) |

### 3.2 Tipografía

Familia: stack del sistema (`-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif`). No cargamos fuentes externas para mantener performance.

Escala Tailwind:

| Token | Tamaño | Uso |
|---|---|---|
| `text-xs` | 12px | Captions, metadata, badges |
| `text-sm` | 14px | Cuerpo, labels, links |
| `text-base` | 16px | Headings de sección (h2) |
| `text-lg` | 18px | Texto destacado |
| `text-xl` | 20px | Page heading (h1 de páginas) |
| `text-2xl` | 24px | Page heading principal (PR title, Explore) |

Pesos: `font-normal` (body), `font-medium` (labels, buttons), `font-semibold` (headings).

### 3.3 Espaciado

Múltiplos de 4px siguiendo la escala default de Tailwind: **4 / 8 / 12 / 16 / 24 / 32 px**. Aplicado mediante utilidades `gap-{1,2,3,4,6,8}`, `p-{2,3,4}`, `space-y-{2,3,4,6,8}`. Cards usan `p-4` (16px). Secciones se separan con `space-y-8` (32px).

### 3.4 Bordes y elevación

- Border radius: `rounded` (4px) para badges, `rounded-md` (6px) por defecto, `rounded-lg` (8px) para modales y banners destacados, `rounded-full` para avatars y pills.
- Elevación: usamos **bordes + diferencias de fondo** en vez de sombras pesadas (`gh-canvas` vs. `gh-canvas-subtle`). Modal usa `shadow-xl` como excepción para enfatizar overlay.

### 3.5 Estilos de elementos clave

- **Botones** (`src/components/ui/Button.tsx`): cuatro variantes (default, primary, danger, outline) × dos tamaños (sm, md). Todos comparten: `rounded-md`, transición de color, `disabled:opacity-50 disabled:cursor-not-allowed`, `focus-visible:ring-2 ring-gh-accent`, `active:scale-[0.98]`.
- **Inputs**: `bg-gh-canvas`, `border-gh-border`, `rounded-md`, `focus:ring-2 ring-gh-accent`, `disabled:opacity-50`. Error state: borde rojo + mensaje `text-xs text-gh-danger` debajo. Validación inline con `aria-invalid` y `aria-describedby`.
- **Links**: `text-gh-accent`, `hover:underline`. Sin underline por defecto para no saturar.
- **Badges**: pill con borde semitransparente, fondo con `opacity 20%` del color de estado.

### 3.6 Iconografía

**Librería:** lucide-react (única, en todo el proyecto). Estilo **line / outline** (no filled, excepto Star activo). Tamaños:

- `w-3 h-3` (12px) — íconos dentro de pills/badges
- `w-3.5 h-3.5` (14px) — íconos inline en botones sm
- `w-4 h-4` (16px) — íconos en botones md y navegación
- `w-5 h-5` (20px) — íconos de navbar destacados
- `w-6 h-6` (24px) — íconos en Quick Actions y EmptyState

### 3.7 Tono y voz

- Tratamiento al usuario en **segunda persona (tú)**: "Marca tu primer favorito", "Confirma tu contraseña".
- Tono **cercano-formal**: directo, sin jerga innecesaria, pero respetando convenciones técnicas (no traducimos *pull request*, *fork*, *merge*, *token*).
- Mensajes de error en **lenguaje natural** y constructivos: *"El nombre del repositorio es obligatorio"* en vez de *"Validation failed: name required"*.
- Títulos en **sentence case**: "Generate new token", no "Generate New Token".

---

## 4. Decisiones de diseño

Tres decisiones fundamentadas que están detrás de las pantallas.

### 4.1 Reorganización por frecuencia (no por categoría)

Esta es la decisión más transversal y la que mejor encarna el reframe del problema. La aplicamos a:

- **Settings**: tokens y SSH keys subidos a primer nivel (vs. enterrados en Developer Settings)
- **Repo header**: visibility toggle inline (vs. Danger Zone)
- **Home**: favoritos sobre listado completo (vs. listado plano alfabético)

**Justificación teórica:** la ley de Hick predice que el tiempo de decisión escala con el log del número de opciones; promover las opciones frecuentes reduce ese costo. La jerarquía visual (color, posición, tamaño) hace que el ojo aterrice primero en lo común — y lo poco frecuente sigue accesible, pero no compite por la atención.

**Cómo se valida en código:** ver `SettingsSidebar.tsx` (líneas con `highlight: true` y badge "Quick"), `RepoHeader.tsx` (botón Make private/public al mismo nivel que Star y Fork).

### 4.2 Gestalt de proximidad y similitud en el Home Dashboard

Aplicado al layout de `/`:

- **Similitud**: las tres secciones de información (Favorite, Most Used, Recent PRs) comparten estructura interna idéntica (header con ícono + título, lista con borde común, ítems con padding consistente). El usuario los lee como "tres lentes sobre el mismo tipo de información", no como tres widgets dispersos.
- **Proximidad**: dentro de cada card, los metadatos del repo (lenguaje, stars, last access) están juntos con `gap-3` y separados del nombre/descripción con `space-y-2`. Entre secciones, `space-y-8` (32px) separa visualmente los bloques sin perder pertenencia a la misma página.
- **Figura/fondo**: cards con `bg-gh-canvas-subtle` se elevan sobre el `bg-gh-canvas` del body, creando jerarquía sin necesidad de sombras pesadas.

**Cómo se valida:** ver `src/app/page.tsx` + los tres componentes de `src/components/home/`.

### 4.3 Progressive disclosure en la vista de Pull Request

La página de un PR tiene 4 dimensiones de información: dirección del merge, estado de revisión, conversación, commits, archivos cambiados. Mostrar todo al mismo nivel satura. Aplicamos disclosure por capas:

1. **Primer plano (sin clic):** MergeDirectionBanner (responde "¿hacia dónde va?") + ReviewProgressBar global (responde "¿dónde estamos?").
2. **Segundo plano (un clic):** tabs Conversation / Commits / Files Changed. Por defecto se abre Conversation porque es la dimensión más usada.
3. **Tercer plano (interacción explícita):** detalle de cada hunk del diff en colapsables, marcar archivo como reviewed con checkbox.

Esto evita el "wall of text" del PR view tradicional y permite que el usuario decida qué profundizar.

**Cómo se valida:** ver `src/app/[user]/[repo]/pull/[id]/page.tsx` (orden del render: banner → tabs → contenido); `src/components/pr/DiffViewer.tsx` (colapsables por archivo).

### 4.4 (Adicional) Vocabulario visual estable

Para reforzar el modelo mental, mantuvimos un vocabulario de colores semánticos consistente en toda la app:

- 🟢 **Verde (`gh-success`)** — Avance, merge exitoso, base branch destino, estado approved
- 🟣 **Púrpura (`gh-done`)** — PR merged (estado terminal positivo)
- 🔵 **Azul (`gh-accent`)** — Info, links, focus, branch fuente
- 🔴 **Rojo (`gh-danger`)** — Errores, acciones destructivas, changes requested
- 🟡 **Amarillo (`gh-warning`)** — Advertencias, repos privados, pending

El usuario aprende el vocabulario una vez y lo reutiliza en cada vista, lo que reduce carga cognitiva.

---

## 5. Decisiones técnicas

### 5.1 Stack

- **Next.js 14 (App Router)** con TypeScript estricto. Elegimos App Router por: routing basado en archivos, layouts compartidos, y soporte nativo de Server Components que reduce JavaScript enviado al cliente.
- **Tailwind CSS** para estilos. Permite mantener el style guide *en el código* (los tokens `gh-*` viven en `tailwind.config.ts`) y elimina la fricción de CSS separado.
- **lucide-react** como única librería de íconos. Estilo line uniforme.
- **Sin backend**: toda la data está hardcodeada en `src/data/` (`repos.ts`, `pullRequests.ts`, `users.ts`, `files.ts`, `tokens.ts`, `sshKeys.ts`), tipada con `src/types/index.ts`. Persistencia ligera del estado de UI (favoritos, visibilidad de repo) en `localStorage` vía Context API.

### 5.2 Server vs. Client Components

Aplicamos la regla: **Server por default, Client sólo donde hay state, eventos o APIs de browser**.

Ejemplos:

- **Server components** (sin `"use client"`): `Home` (`src/app/page.tsx`), `Explore` (`src/app/explore/page.tsx`), `Settings` (perfil), `EmptyState`, `Card`, `Badge`, `Avatar`, `MergeDirectionBanner`, `ReviewProgressBar`, `RecentActivity` lo era inicialmente — lo convertimos a Client cuando agregamos el "Show more" con `useState`.
- **Client components** (con `"use client"`): cualquier cosa con `useState`/`useEffect` (`TokensPage`, `SSHKeysPage`, `FileBrowser`), contextos (`FavoritesContext`, `VisibilityContext`), navegación con `usePathname` (`Navbar`, `SettingsSidebar`), modales interactivos (`RepoHeader`, `QuickActions`).

Esta separación se justifica también con un comentario corto al inicio de los archivos no triviales: por ejemplo, `// Client component: usa localStorage (browser API) y mantiene state reactivo` en `FavoritesContext.tsx`.

### 5.3 Estrategia de rendering

- **Estática (SSG)**: home, explore, settings (perfil), tokens, ssh-keys. Toda la data está disponible en build time, no hay razón para SSR.
- **Dinámica (SSR on-demand)**: rutas con parámetros `/[user]/[repo]` y `/[user]/[repo]/pull/[id]`. Next.js las marca como `ƒ (Dynamic)` en el output del build.
- **Client-side interactivity**: estados de modales, toggles, formularios. Simulados con `setTimeout` para demostrar transiciones loading → success sin un backend real.

### 5.4 Gestión de estado

Tres `Context` providers, todos en `src/context/`, anidados en `src/app/layout.tsx`:

- `FavoritesContext`: set de strings `"owner/name"` marcadas como favoritas, persistidas en `localStorage` (clave `gh-favorites`).
- `VisibilityContext`: mapa `{ "owner/name": "public" | "private" }` para cambios de visibilidad, persistidos en `localStorage` (clave `gh-visibility`).
- `SecurityContext`: timestamp `verifiedUntil` que indica hasta cuándo dura la sesión "sudo" del usuario. Persistido en `localStorage` (clave `gh-security-verified-until`) con TTL de 30 minutos. Hidrata desde storage al montar; un `setInterval` cada 5s invalida el state cuando expira. Lo consume `<SecurityGate>` (gate de ruta para `/settings/tokens` y `/settings/ssh-keys`) y `SettingsSidebar` (para saltar el modal cuando ya está verificado).

No introdujimos Redux ni Zustand: el estado global es mínimo y Context es suficiente. El resto del state es local (`useState` por componente). Justificación: añadir una librería de estado para tres contextos sería un over-engineering.

### 5.5 Estructura de carpetas

```
src/
├── app/                    # Rutas (App Router)
│   ├── [user]/[repo]/      # Repo y PR (rutas dinámicas)
│   ├── explore/            # Trending + tus repos
│   ├── settings/           # Profile, tokens, ssh-keys
│   ├── layout.tsx          # Root con Navbar + Providers
│   └── page.tsx            # Home dashboard
├── components/
│   ├── home/               # Bloques del dashboard
│   ├── layout/             # Navbar
│   ├── pr/                 # MergeDirectionBanner, ReviewProgressBar, DiffViewer, ...
│   ├── repo/               # RepoHeader, FileBrowser, ReadmePreview
│   ├── settings/           # SettingsSidebar
│   └── ui/                 # Button, Modal, Card, Badge, Tabs, Toggle, EmptyState, ...
├── context/                # FavoritesContext, VisibilityContext
├── data/                   # Mock data tipada
├── lib/                    # Utilidades (timeAgo, formatDate)
└── types/                  # Interfaces TypeScript centralizadas
```

Organización **por dominio** dentro de `components/`, no por tipo. Esto facilita encontrar todo lo relacionado a una feature en una sola carpeta.

### 5.6 Herramientas externas

Usamos **Claude Code** como asistente de desarrollo durante toda la entrega. Las decisiones de producto, diseño y reframe del problema son autoría del equipo; el asistente nos ayudó a iterar más rápido sobre la implementación TypeScript/React, a auditar gaps en estados de interacción y a sugerir mejoras de accesibilidad (ARIA, focus states).

---

## 6. Estado de avance y próximos pasos

### 6.1 Implementado

- Las **5 features** completas con flujos end-to-end navegables (sin `href="#"` y sin "coming soon" en pantalla).
- **Reframe del problema** visible tanto en el informe (sección 1) como encarnado en la UI en cuatro callouts contextuales (`SettingsSidebar`, `RepoHeader`, `MergeDirectionBanner`, `ReviewProgressBar`).
- **Estados de interacción** cubiertos en los componentes principales: `hover`, `focus-visible`, `active`, `disabled`, `loading` (spinners + botones deshabilitados durante submit), `empty` (componente `EmptyState` reutilizable usado en 4 lugares), `error` (validación inline con `aria-invalid` y mensajes).
- **Accesibilidad básica**: roles ARIA (`role="tab"`, `role="switch"`, `role="alert"`, `role="status"`), `aria-selected`, `aria-checked`, `aria-current="page"`, `aria-pressed`, labels y `aria-describedby` para errores. Navegación por teclado con focus rings visibles.
- **Style guide** formalizado y consistente con la implementación.
- Página `/explore` adicional con trending + tus repos.

### 6.2 Fuera de alcance E2

- Tabs **Issues** y **Actions** del repo: placeholders explícitos (no son flujos cubiertos por nuestros pains/gains).
- Compresión **ZIP real** en folder download: entregamos un manifest JSON funcional que demuestra el flujo (Blob + download). Adoptar JSZip añadiría peso y complejidad sin valor evaluativo.
- **Modo claro**: trabajamos sólo el dark theme (paleta `gh-*`), alineado con la estética de GitHub original.

### 6.3 Planificado para E3

- **User testing** con 5 estudiantes de computación para validar empíricamente el reframe. Métricas: tiempo a completar tareas comparado con GitHub real, errores cometidos, satisfacción subjetiva (SUS).
- **Accesibilidad avanzada**: auditoría WCAG AA (contraste, contraste de focus rings, navegación 100% por teclado), pruebas con lector de pantalla.
- **Responsive mobile**: la app está pensada desktop-first; queremos extender a tablet y mobile con un layout reorganizado (sidebar collapsable, tabs con scroll horizontal).
- **Animaciones / Motion Design**: micro-interacciones en transiciones de tabs, en aparición de modales, en cambios de estado (token creado, PR merged).
- **Data-Heavy UI**: dashboard de actividad agregada del equipo (commits, PRs, reviews) que aplique los mismos principios a una vista de datos densa.

---

## Anexos

### Anexo A — Capturas de pantalla

_📸 [Insertar aquí las capturas mencionadas a lo largo del informe]_

1. Home dashboard completo (sección 2.1)
2. Quick Action "New Repository" modal en estado form / loading / success (sección 2.1)
3. Sidebar de Settings con callout "Frecuencia sobre completitud" + tokens page (sección 2.2)
4. Tokens page con formulario en loading state (sección 2.2)
5. Tokens page con empty state (sección 2.2)
6. Repo header con visibility toggle + callout (sección 2.3)
7. Modal de confirmación de cambio de visibility (sección 2.3)
8. File browser con folder en hover mostrando botón de descarga + toast (sección 2.4)
9. PR view con MergeDirectionBanner arriba + sidebar de Review Progress (sección 2.5)
10. PR view en tab "Files Changed" con diff y checkbox de review (sección 2.5)
11. Capturas de los estados del Button (default, hover, focus, disabled) — sección 3.5
12. Captura del EmptyState reutilizable en FavoriteRepos (sección 3.5)

### Anexo B — Cómo correr el proyecto

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # producción
npm run lint
```

Rutas para recorrer manualmente:

- `/` — Home dashboard
- `/explore` — Trending y tus repos
- `/javier-lopez/proyecto-interfaces` — Repo (probar visibility toggle + folder download)
- `/javier-lopez/proyecto-interfaces/pull/1` — PR view (banner + progress)
- `/settings` — Profile (placeholder, mínimo)
- `/settings/tokens` — Crear/borrar tokens (probar loading + error states)
- `/settings/ssh-keys` — Agregar SSH key (probar validación de formato)
