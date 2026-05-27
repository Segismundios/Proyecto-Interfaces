// Client component: consume UserDataContext (notificaciones mutables en
// localStorage) para marcar como leídas; requiere router context y browser.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, GitPullRequest, CircleDot, AtSign, CheckCircle, Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useUserData } from "@/context/UserDataContext";
import { AppNotification } from "@/types";
import { timeAgo } from "@/lib/utils";

type FilterType = "all" | "unread" | "mention";

const typeIcon: Record<AppNotification["type"], React.ReactNode> = {
  pr: <GitPullRequest className="w-4 h-4 text-gh-done" />,
  issue: <CircleDot className="w-4 h-4 text-gh-success" />,
  mention: <AtSign className="w-4 h-4 text-gh-accent" />,
  ci: <CheckCircle className="w-4 h-4 text-gh-fg-muted" />,
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } =
    useUserData();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "mention") return n.type === "mention";
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gh-fg" />
          <h1 className="text-xl font-semibold text-gh-fg">Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gh-accent/20 text-gh-accent font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button size="sm" onClick={markAllNotificationsRead}>
            <Check className="w-3.5 h-3.5" />
            Marcar todo como leído
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-1 border border-gh-border rounded-md overflow-hidden w-fit">
        {(["all", "unread", "mention"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-gh-btn-bg text-gh-fg"
                : "text-gh-fg-muted hover:text-gh-fg"
            } ${f !== "all" ? "border-l border-gh-border" : ""}`}
          >
            {f === "all" && "Todas"}
            {f === "unread" && "Sin leer"}
            {f === "mention" && "Menciones"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin notificaciones"
          description={
            filter === "unread"
              ? "No tienes notificaciones sin leer."
              : filter === "mention"
              ? "No tienes menciones recientes."
              : "No tienes notificaciones."
          }
        />
      ) : (
        <div className="border border-gh-border rounded-md overflow-hidden">
          {filtered.map((notif, i) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                !notif.read ? "bg-gh-accent/5" : "hover:bg-gh-canvas-subtle"
              } ${i < filtered.length - 1 ? "border-b border-gh-border" : ""}`}
              onClick={() => {
                markNotificationRead(notif.id);
                router.push(notif.href);
              }}
            >
              {/* Dot de no leído */}
              <div className="mt-1 w-4 shrink-0">
                {!notif.read && (
                  <span className="block w-2 h-2 rounded-full bg-gh-accent" aria-hidden />
                )}
              </div>

              {/* Ícono del tipo */}
              <div className="mt-0.5 shrink-0">{typeIcon[notif.type]}</div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    notif.read ? "text-gh-fg-muted" : "text-gh-fg font-medium"
                  }`}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-gh-fg-muted mt-0.5 truncate">{notif.body}</p>
                <p className="text-[11px] text-gh-fg-muted mt-1">
                  {notif.repoOwner}/{notif.repoName} &middot; {timeAgo(notif.createdAt)}
                </p>
              </div>

              {/* Marcar como leído */}
              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notif.id);
                  }}
                  title="Marcar como leído"
                  className="mt-1 text-gh-fg-muted hover:text-gh-fg transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
