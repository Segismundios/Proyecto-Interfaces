# Entrega 3: Validación con usuarios y proyecto final
### DevHub · Clon de GitHub con mejoras de UX

> **Nota para el equipo:** este documento está listo para exportar a PDF. Reemplaza los campos marcados con `⟦…⟧` (integrantes, enlace de despliegue, capturas) antes de entregar. Para convertir a PDF: abrir en VS Code → "Markdown PDF", o pegar en Google Docs, o `pandoc Informe_E3.md -o Informe_E3.pdf`.

---

## 1. Portada e integrantes

| | |
|---|---|
| **Proyecto** | DevHub: Clon de GitHub con mejoras de UX |
| **Curso** | IIC2182: Interfaces y Experiencia de Usuario |
| **Entrega** | E3: Validación con usuarios y proyecto final |
| **Grupo** | ⟦N° / nombre del grupo⟧ |
| **Integrantes** | ⟦Nombre 1⟧ · ⟦Nombre 2⟧ · ⟦Nombre 3⟧ · ⟦Nombre 4⟧ |
| **Repositorio** | https://github.com/Segismundios/Proyecto-Interfaces |
| **Despliegue (Vercel)** | https://devhub-kappa-seven.vercel.app/ |
| **Fecha** | Junio 2026 |

---

## 2. Resumen del proyecto

### 2.1 Problema y usuario objetivo

**Usuario objetivo:** estudiantes de computación y desarrolladores junior que usan GitHub a diario para gestionar sus repositorios de cursos y proyectos personales.

**Problema:** la interfaz actual de GitHub optimiza para un usuario "experto" y entierra acciones que para este perfil son **frecuentes**: cambiar la visibilidad de un repositorio (vive en *Settings → Danger Zone*), generar tokens de acceso (a tres niveles de profundidad), o entender el estado de revisión de una Pull Request (información dispersa y en lenguaje que asume dominio de git). Además, faltan funcionalidades concretas como descargar una sola carpeta sin clonar todo el repositorio.

### 2.2 Propuesta de valor (VPC actualizado)

| Perfil del usuario | Mapa de valor (DevHub) |
|---|---|
| **Tareas (jobs):** gestionar repos, revisar PRs, administrar credenciales (tokens/SSH), ajustar configuración de repos, obtener código. | **Productos/servicios:** dashboard enfocado en repos, header de repo con acciones frecuentes, vista de PR con ayudas visuales, settings reorganizado, file browser con descarga granular. |
| **Dolores (pains):** acciones frecuentes enterradas; información de PR que asume conocimiento de git; no poder descargar solo una carpeta; flujos que terminan en callejones sin salida. | **Calmantes (pain relievers):** toggle de visibilidad junto a Star/Fork; tokens/SSH en primer nivel; banner de dirección del merge; verificación de seguridad con salida clara. |
| **Beneficios (gains):** rapidez en acciones frecuentes; claridad del proceso de revisión; control granular sobre el código. | **Creadores de beneficio (gain creators):** descarga por carpeta/archivo; progreso de revisión visible para todos; dashboard que prioriza repositorios. |

Las cinco mejoras base (heredadas de E2) son: **(1)** Home Dashboard, **(2)** reorganización de Settings con tokens/SSH al primer nivel, **(3)** toggle de visibilidad en el header, **(4)** descarga de carpetas, **(5)** visualización de PR (dirección del merge + progreso de revisión).

---

## 3. Diseño del user testing

### 3.1 Participantes

Se reclutaron **3 participantes** representativos del usuario objetivo definido en E1, externos al equipo y al cuerpo docente.

| Participante | Perfil | Relación con GitHub |
|---|---|---|
| P1: Felipe | Estudiante de computación, 4° año | Usuario habitual |
| P2: "Salinas" | Estudiante de computación | Usuario **experimentado**, acostumbrado a GitHub |
| P3: "Mananinane" | Estudiante de computación | Usuario habitual |

> Se gestionó el consentimiento de los participantes. P3 no autorizó mostrar rostro en la evidencia.

### 3.2 Método e instrumentos

- **Testing moderado de tareas** con protocolo *think-aloud* (el participante verbaliza lo que piensa mientras opera el prototipo).
- **Registro de éxito/fricción por tarea** y de citas relevantes.
- **Instrumento complementario:** cuestionario **SUS** (System Usability Scale).

### 3.3 Guion de tareas

| # | Tarea | Objetivo de observación |
|---|---|---|
| T1 | "Analiza la landing/dashboard: ¿qué es útil?, ¿qué sobra?" | Jerarquía y utilidad percibida del Home |
| T2 | "Entra a un repositorio y cambia su visibilidad a privado." | Descubribilidad del toggle (Mejora 3) |
| T3 | "Descarga la carpeta `public`." | Descubribilidad de la descarga por carpeta (Mejora 4) |
| T4 | "Abre una PR en estado *open* y explica lo que entiendes." | Comprensión de la visualización de PR (Mejora 5) |
| T5 | "Crea un token de acceso." | Reorganización de Settings (Mejora 2) |
| T6 | "Busca/gestiona tus repositorios" y "crea una Pull Request." | Completitud del flujo principal |

---

## 4. Resultados y hallazgos

### 4.1 Tasas de éxito por tarea

> Estudio cualitativo con 3 participantes. **Éxito** = tarea completada · **Parcial** = completada con fricción · **Falla** = no completable · **n/a** = no evaluada con ese participante.

| Tarea | P1 | P2 | P3 | Observación clave |
|---|:--:|:--:|:--:|---|
| T1 Landing | Parcial | Parcial | Éxito | Útil y mejor que GitHub, pero "Recent PRs" queda escondido y "Settings" se percibe redundante |
| T2 Visibilidad | Éxito | Éxito | Éxito | "Lo encuentra de inmediato"; más intuitivo que GitHub |
| T3 Descarga carpeta | Parcial | Parcial | Parcial | Se completa, pero **solo se descubre al pasar el mouse** (hover) |
| T4 Comprensión de PR | Parcial | Éxito | Éxito | Se entiende por la dirección del merge y las fotos; confusión en colores y en los "puntos" de file coverage |
| T5 Crear token | Éxito | Éxito | Éxito | "Rápido, intuitivo y sin problemas"; mucho menos engorroso que GitHub |
| T6a Ver "mis repos" | n/a | Falla | n/a | "Your repositories" llevaba a **un** repo, no a la lista |
| T6b Crear PR | n/a | n/a | Falla | **No existía** la opción de crear PR dentro del repo |

**SUS:** se aplicó el cuestionario; el puntaje registrado fue **82.5** (suma de 33), por encima del benchmark de la industria (**68**) → usabilidad percibida "buena/excelente".

### 4.2 Aciertos validados (lo que funciona y se conserva)

- **Dashboard enfocado en repos:** "Le pareció mucho más útil que la landing page de GitHub […] está más enfocada en repositorios, que es por lo que la gente usa la plataforma" (P3).
- **Toggle de visibilidad:** los 3 lo encontraron de inmediato. "Se le hizo muy intuitivo que el botón esté al lado donde se indica la visibilidad y menos engorroso que cómo funciona en GitHub" (P2).
- **Descarga por carpeta (concepto):** "Es una de las mejores features […] algo que realmente le hace falta a GitHub" (P3); "algo que ha echado en falta en la competencia" (P1).
- **Dirección del merge primero:** "La dirección del merge como lo primero que se ve le parece lo mejor" (P1).
- **Progreso de revisión visible:** "Encontró útil que visualmente puede ver quiénes faltan que evalúen la PR, quiénes pidieron cambios, cuáles archivos se revisaron" (P3).
- **Tokens/SSH en primer nivel:** "Mucho más directo y rápido de encontrar que en GitHub" (P3).

### 4.3 Fricciones y problemas detectados

**Críticos (callejones sin salida / flujos rotos):**
- **C1 · Gate de seguridad atrapa al usuario:** "si accedes a `/settings/tokens` o `/settings/ssh-keys` sin verificarte, el modal de verificación no se puede quitar y no puedes volver a `/settings`" (P3). Sugirió que la verificación "apareciera como contenido de la ruta, no como un modal".
- **C2 · "Your repositories" lleva al lugar equivocado:** "al hacerle click se manda a un repositorio específico en vez de una vista con todos los repositorios" (P2).
- **C3 · No se puede crear una PR:** "no existía la opción de crear una pull request dentro del repositorio, no se mostraban las branches […] y en la quick action de crear pull request no se podía seleccionar un repositorio" (P3).

**De usabilidad (UI/UX):**
- **H1 · Color de la barra de review:** "La barra verde […] debería estar roja cuando alguien pide cambios y verde solo cuando esté aprobado por todos. Si no está completa, debería ser amarilla" (P1).
- **H2 · "Puntos" de file coverage confusos:** "No entiende a simple vista los puntos verdes en file coverage; no sabe si indican revisión o aprobación" (P1).
- **H3 · Revisores amontonados:** "si hubieran muchos revisores […] los iconos de usuario se acumularían demasiado. La solución es dejar un número fijo como 3 y luego un icono +N" (P2).
- **H4 · Descarga solo en hover e inconsistente:** "el icono de descarga debería estar fijo, ya que no se hubiera dado cuenta de la funcionalidad hasta pasar el mouse" (P2); "encontró raro que el icono solo apareciera en los directorios y no en los archivos" (P3).
- **H5 · Falta rol en los comentarios:** "agregaría una etiqueta de reviewer/autor al comentario de la conversación de un usuario" (P2).
- **H6 · Cambio de visibilidad sin fricción:** "al cambiar el repositorio público a privado se le añada un paso extra de seguridad al modal, como escribir literalmente una frase de confirmación" (P2).

**De presentación (landing):**
- **M1 · "Settings" redundante:** aparecía en quick actions, navbar y menú de usuario (P1 y P3).
- **M2 · Acumulación infinita:** "los repos favoritos se pudieran colapsar o mostrar un número acotado para que no se fueran acumulando infinitamente hacia abajo" (P2).
- **M3 · "Recent PRs" escondido:** "no lo vio en un inicio porque está muy escondido hacia abajo" (P2).
- **M4 · Estética del sidebar:** "la línea que separa el perfil de los repos no le convence mucho estéticamente" (P2).

---

## 5. Plan de mejora

Problemas priorizados por **severidad × impacto en el usuario**, con la mejora propuesta y su justificación teórica.

| # | Problema | Sev. | Mejora propuesta | Justificación teórica |
|---|---|:--:|---|---|
| C1 | Gate = callejón sin salida | Crítica | Verificación **inline** con salida "Volver a Settings" | Control y libertad del usuario; salidas de emergencia (Nielsen #3) |
| C2 | "Your repositories" → 1 repo | Crítica | Vista **`/[user]`** con todos los repos + filtro | Correspondencia entre el sistema y el mundo real; consistencia |
| C3 | No se puede crear PR | Crítica | Modal de PR con **selector de repo + ramas**; entrada en el repo | Completitud del flujo; visibilidad de las opciones |
| H1 | Barra siempre verde | Alta | Color **agregado** (rojo/amarillo/verde) + etiqueta de estado | Visibilidad del estado del sistema; mapeo color→significado |
| H2 | Puntos confusos | Alta | **Leyenda** explícita | Reconocer en vez de recordar |
| H3 | Revisores amontonados | Alta | Máx. 3 + **"+N"** | Control de densidad; consistencia |
| H4 | Descarga oculta/inconsistente | Alta | Botón **fijo**, en archivos y carpetas, en columna propia | Affordance/descubribilidad; consistencia |
| H5 | Sin rol en comentarios | Alta | Badge **Author/Reviewer** | Jerarquía e identidad de la información |
| H6 | Visibilidad sin fricción | Alta | **Type-to-confirm** (escribir el nombre del repo) | Prevención de errores en acciones sensibles |
| M1 | "Settings" redundante | Media | Quitar de Quick Actions; agregar "New Issue" | Minimalismo; reducción de redundancia |
| M2 | Acumulación infinita | Media | **"Ver más"** en favoritos y sidebar | Progressive disclosure |
| M3 | "Recent PRs" escondido | Media | Reordenar: subir Recent PRs | Jerarquía visual (importancia→posición) |
| M4 | Estética del sidebar | Media | Perfil como tarjeta; separadores suaves | Estética y diseño minimalista |

**Implementadas en E3:** todas las anteriores (C1 a C3, H1 a H6, M1 a M4).
**Trabajo futuro:** ver sección 8.

---

## 6. Mejoras implementadas (antes / después)

> Las capturas marcadas con `⟦Captura⟧` deben tomarse del despliegue final. Se indica exactamente qué mostrar.

### 6.1 Críticas: Completitud del flujo

**C1 · Gate de seguridad inline**
Antes: overlay modal bloqueante con preview borroso; sin contraseña el usuario quedaba atrapado, sin forma de volver a `/settings`.
Después: la verificación es contenido de la ruta, con enlace **"Volver a Settings"**; el sidebar de Settings permanece accesible.
Archivo: `src/components/ui/SecurityGate.tsx`.
⟦Captura: `/settings/tokens` sin verificar, mostrando la tarjeta inline y el enlace de salida⟧

**C2 · Vista de todos los repos (`/[user]`)**
Antes: "Your repositories" del menú llevaba a un repositorio concreto.
Después: nueva vista de perfil que lista **todos** los repos con buscador y filtro de visibilidad; "Your repositories" y "Ver todos" apuntan ahí.
Archivos: `src/app/[user]/page.tsx` (nuevo), `src/components/layout/Navbar.tsx`, `src/components/home/SidebarRepoList.tsx`.
⟦Captura: `/javier-lopez` con la lista y el filtro Todos/Public/Private⟧

**C3 · Crear Pull Request (flujo completo)**
Antes: el quick-action no permitía elegir repositorio ni mostraba ramas; dentro del repo no había entrada para crear PR; el selector de rama del file browser no hacía nada.
Después: componente reutilizable `NewPullRequestModal` con **selector de repositorio** y **dropdowns de rama** (poblados desde `src/data/branches.ts`); botón **"New pull request"** en el tab del repo y en su empty-state; selector de rama del file browser ahora funcional.
Archivos: `src/components/pr/NewPullRequestModal.tsx` (nuevo), `src/data/branches.ts` (nuevo), `src/components/home/QuickActions.tsx`, `src/app/[user]/[repo]/page.tsx`, `src/components/repo/FileBrowser.tsx`.
⟦Captura: modal de PR con repo y ramas seleccionables⟧

### 6.2 Altas: Calidad de UI/UX

**H1 · Color semántico de la barra de review**: rojo si algún revisor pide cambios, verde solo si todos aprueban, amarillo si falta alguien, con una *pill* de estado textual. `src/components/pr/ReviewProgressBar.tsx`. ⟦Captura: PR #1 (barra roja "Changes requested") vs PR #2 (verde "Approved by all")⟧
**H2 · Leyenda en file coverage**: "revisado / sin revisar" + aclaración de los avatares. ⟦Captura: leyenda visible⟧
**H3 · Overflow "+N"**: máximo 3 avatares por archivo y burbuja "+N" (demostrable en la PR #1, con un archivo revisado por 4 personas). ⟦Captura: archivo con "+1"⟧
**H4 · Descarga fija, en archivos y carpetas**: botón siempre visible en una columna dedicada a la derecha. `src/components/repo/FileBrowser.tsx`. ⟦Captura: file browser con iconos de descarga fijos en filas de archivo y de carpeta⟧
**H5 · Etiquetas Author/Reviewer**: badge de rol en cada comentario de la conversación. `src/components/pr/PRTimeline.tsx`. ⟦Captura: conversación con badges⟧
**H6 · Type-to-confirm de visibilidad**: el botón se habilita solo al escribir el nombre del repo. `src/components/repo/RepoHeader.tsx`. ⟦Captura: modal con el input de confirmación⟧

### 6.3 Medias: Presentación (landing)

**M1** Quick Actions sin "Settings", con "New Issue" · **M2** "Ver más" en favoritos y sidebar · **M3** Recent PRs reubicado por encima de Most Used · **M4** perfil con tratamiento de tarjeta y separadores suavizados.
Archivos: `src/components/home/QuickActions.tsx`, `src/components/home/FavoriteRepos.tsx`, `src/components/home/SidebarRepoList.tsx`, `src/app/page.tsx`.
⟦Captura: landing final⟧

---

## 7. Valor entregado al usuario

El informe deja explícito cómo DevHub resuelve al menos un **dolor** y entrega al menos una **ganancia**, conectados con la propuesta de valor de E1 y con la evidencia del testing.

### Dolor resuelto (pain): "las acciones frecuentes están enterradas"
En E1 identificamos que GitHub esconde acciones cotidianas (visibilidad en *Danger Zone*, tokens a 3 niveles). DevHub las promueve a primer plano: toggle de visibilidad en el header (con confirmación segura) y tokens/SSH como ítems de primer nivel.
**Evidencia del testing:** los 3 participantes completaron T2 y T5 sin fricción; "lo encuentra de inmediato" (P1), "rápido, intuitivo y sin problemas […] mucho menos engorroso que en GitHub" (P2/P3). El SUS de 82.5 (> 68) respalda la percepción global.

### Ganancia entregada (gain): "descarga granular del código"
La propuesta de valor de E1 incluía dar **control granular** sobre el código. DevHub permite descargar una carpeta (y, tras el testing, también un archivo) directamente desde el explorador.
**Evidencia del testing:** valorada espontáneamente por los 3; "una de las mejores features […] algo que realmente le hace falta a GitHub" (P3). El testing además reveló que la descarga **no se descubría** (solo en hover): la corrección (botón fijo) convierte una ganancia *potencial* en una ganancia *efectiva*.

---

## 8. Reflexión y trabajo futuro

### 8.1 Aprendizajes del proceso iterativo
- **El testing revela los puntos ciegos del equipo:** funciones que dábamos por "descubiertas" (la descarga) eran invisibles para el usuario hasta el hover. Lo que para nosotros era obvio, para el usuario no existía.
- **Validar no es solo confirmar:** el SUS alto (82.5) convivía con **3 flujos rotos** que solo emergieron al observar tareas reales (crear PR, "mis repos", el gate). Un buen puntaje no exime de mirar las tareas críticas.
- **El usuario propone soluciones concretas:** varias mejoras (el "+N", el type-to-confirm, la verificación inline) salieron casi textuales de los participantes; escucharlas literalmente aceleró el diseño.
- **Priorizar por severidad:** separar "callejones sin salida" (completitud) de "fricciones" (pulido) permitió atacar primero lo que rompía el valor del producto.

### 8.2 Trabajo futuro (priorizado, no implementado en E3)
- Mostrar la etiqueta de rol también en el diff (no solo en la conversación).
- Recordar la rama elegida en el file browser entre navegaciones (hoy es estado efímero).
- Recuperación de contraseña real en el gate (hoy el enlace es decorativo, coherente con el alcance mock).
- Buscador global que también indexe issues y PRs (hoy solo repos).
- Revisar la utilidad de "Explore" en Quick Actions (P2 lo usa poco); evaluar reemplazarlo por accesos a favoritos/PRs recientes.

---

## 9. Anexos

- **Anexo A · Guion de tareas:** sección 3.3 de este informe.
- **Anexo B · Instrumento SUS:** ⟦adjuntar las 10 afirmaciones del SUS y las respuestas; cálculo: suma 33 → 82.5⟧.
- **Anexo C · Registros del testing:** ⟦notas/observaciones por participante; transcripción en `Entrevistas E3.docx`⟧.
- **Anexo D · Evidencia:** ⟦capturas de la sesión, con consentimiento; P3 sin rostro⟧.
- **Anexo E · Mapa técnico de cambios:** ver `DOCUMENTACION.md §18` (hallazgo → mejora → archivos).

### Despliegue e instrucciones de ejecución local
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```
Despliegue en Vercel: https://devhub-kappa-seven.vercel.app/
