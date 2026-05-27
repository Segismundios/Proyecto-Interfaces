import { Issue } from "@/types";

// Issues mock para el repo proyecto-interfaces de javier-lopez.
// Misma forma de datos en todos los estados (open, closed) para consistencia.
export const issuesData: Issue[] = [
  {
    id: 1,
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    title: "Mejorar contraste del badge de visibilidad en tema oscuro",
    body: "El badge 'private' en el header del repo tiene contraste insuficiente bajo ciertas configuraciones de monitor. Debería cumplir WCAG AA (ratio 4.5:1).\n\n**Reproducción:** Abrir cualquier repo privado y verificar el badge amarillo sobre fondo oscuro.\n\n**Criterio de aceptación:** El badge cumple WCAG AA en modo oscuro.",
    status: "open",
    author: "maria-garcia",
    labels: ["accessibility", "ui"],
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
    comments: [],
  },
  {
    id: 2,
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    title: "El modal de New Repository no limpia el formulario al cerrarse",
    body: "Al abrir el modal de 'New Repository' desde Quick Actions, completar el formulario a medias y cerrarlo con Escape, el formulario retiene los valores anteriores al volver a abrirlo.\n\n**Comportamiento esperado:** El formulario debe resetearse al cerrar el modal.",
    status: "open",
    author: "carlos-ruiz",
    labels: ["bug"],
    createdAt: "2026-04-12T14:00:00Z",
    updatedAt: "2026-04-12T14:30:00Z",
    comments: [
      {
        id: "c1",
        author: "javier-lopez",
        body: "Confirmado. Veo que el estado del formulario está en QuickActions y no se resetea en onClose. Lo arreglo esta semana.",
        createdAt: "2026-04-12T15:00:00Z",
      },
    ],
  },
  {
    id: 3,
    repoOwner: "javier-lopez",
    repoName: "proyecto-interfaces",
    title: "Agregar empty state a la sección de PRs recientes cuando no hay PRs",
    body: "Si el usuario no tiene pull requests recientes, la sección 'Recent Pull Requests' del home muestra un mensaje de texto plano sin ilustración ni CTA. Debería usar el componente `EmptyState` para ser consistente con el resto de la app.",
    status: "closed",
    author: "ana-martinez",
    labels: ["enhancement", "ui"],
    createdAt: "2026-04-05T11:00:00Z",
    updatedAt: "2026-04-08T10:00:00Z",
    comments: [
      {
        id: "c2",
        author: "javier-lopez",
        body: "Implementado en el PR #1. El EmptyState ya está en uso.",
        createdAt: "2026-04-08T10:00:00Z",
      },
    ],
  },
];
