// Client component: store unificado del usuario sobre useLocalStorage ("gh-userdata").
// Concentra el estado mutable (issues, PRs, notificaciones, forks, watches, perfil)
// en un solo Context para evitar N providers anidados (justificado: 5 slices mutables).
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Issue, IssueComment, WorkflowRun, AppNotification, UserProfile, PullRequest } from "@/types";
import { issuesData } from "@/data/issues";
import { workflowRunsData } from "@/data/workflowRuns";
import { notificationsData } from "@/data/notifications";
import { currentUser } from "@/data/users";
import { pullRequests as initialPRs } from "@/data/pullRequests";

/* ─── Forma del store ─── */

interface UserDataStore {
  profile: UserProfile;
  issues: Issue[];
  workflowRuns: WorkflowRun[];
  notifications: AppNotification[];
  /** Forks: set de "owner/name" del repo original */
  forks: string[];
  /** Watches: set de "owner/name" */
  watches: string[];
  /** PRs con estado sobreescrito (ej: merged) */
  prOverrides: Record<number, Partial<PullRequest>>;
}

const defaultStore: UserDataStore = {
  profile: {
    username: currentUser.username,
    displayName: currentUser.displayName,
    avatarUrl: currentUser.avatarUrl,
    bio: currentUser.bio,
    location: "Santiago, Chile",
    email: "javier@ejemplo.cl",
  },
  issues: issuesData,
  workflowRuns: workflowRunsData,
  notifications: notificationsData,
  forks: [],
  watches: [],
  prOverrides: {},
};

/* ─── Context value ─── */

interface UserDataContextValue {
  // Selectors
  profile: UserProfile;
  issues: Issue[];
  workflowRuns: WorkflowRun[];
  notifications: AppNotification[];
  forks: string[];
  watches: string[];
  unreadCount: number;
  // Mutators
  updateProfile: (partial: Partial<UserProfile>) => void;
  addIssue: (issue: Omit<Issue, "id" | "createdAt" | "updatedAt" | "comments">) => void;
  closeIssue: (id: number) => void;
  addCommentToIssue: (issueId: number, comment: Omit<IssueComment, "id">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleFork: (repoKey: string) => void;
  toggleWatch: (repoKey: string) => void;
  mergePR: (prId: number) => void;
  getPRStatus: (prId: number) => PullRequest["status"] | undefined;
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

/* ─── Provider ─── */

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useLocalStorage<UserDataStore>("gh-userdata", defaultStore);

  // Merge missing keys when defaultStore evolves (new slices added later)
  const safeStore: UserDataStore = useMemo(
    () => ({ ...defaultStore, ...store }),
    [store]
  );

  /* Mutators (useCallback para estabilidad de referencias) */

  const updateProfile = useCallback(
    (partial: Partial<UserProfile>) => {
      setStore((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }));
    },
    [setStore]
  );

  const addIssue = useCallback(
    (issue: Omit<Issue, "id" | "createdAt" | "updatedAt" | "comments">) => {
      setStore((prev) => {
        const maxId = prev.issues.reduce((m, i) => Math.max(m, i.id), 0);
        const now = new Date().toISOString();
        const newIssue: Issue = {
          ...issue,
          id: maxId + 1,
          createdAt: now,
          updatedAt: now,
          comments: [],
        };
        return { ...prev, issues: [newIssue, ...prev.issues] };
      });
    },
    [setStore]
  );

  const closeIssue = useCallback(
    (id: number) => {
      setStore((prev) => ({
        ...prev,
        issues: prev.issues.map((i) =>
          i.id === id ? { ...i, status: "closed", updatedAt: new Date().toISOString() } : i
        ),
      }));
    },
    [setStore]
  );

  const addCommentToIssue = useCallback(
    (issueId: number, comment: Omit<IssueComment, "id">) => {
      setStore((prev) => ({
        ...prev,
        issues: prev.issues.map((i) => {
          if (i.id !== issueId) return i;
          const newComment: IssueComment = {
            ...comment,
            id: `c${Date.now()}`,
          };
          return {
            ...i,
            comments: [...i.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [setStore]
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      setStore((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    },
    [setStore]
  );

  const markAllNotificationsRead = useCallback(() => {
    setStore((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [setStore]);

  const toggleFork = useCallback(
    (repoKey: string) => {
      setStore((prev) => {
        const has = prev.forks.includes(repoKey);
        return {
          ...prev,
          forks: has ? prev.forks.filter((f) => f !== repoKey) : [...prev.forks, repoKey],
        };
      });
    },
    [setStore]
  );

  const toggleWatch = useCallback(
    (repoKey: string) => {
      setStore((prev) => {
        const has = prev.watches.includes(repoKey);
        return {
          ...prev,
          watches: has ? prev.watches.filter((w) => w !== repoKey) : [...prev.watches, repoKey],
        };
      });
    },
    [setStore]
  );

  const mergePR = useCallback(
    (prId: number) => {
      setStore((prev) => ({
        ...prev,
        prOverrides: {
          ...prev.prOverrides,
          [prId]: { status: "merged" },
        },
      }));
    },
    [setStore]
  );

  const getPRStatus = useCallback(
    (prId: number): PullRequest["status"] | undefined => {
      const override = safeStore.prOverrides?.[prId];
      if (override?.status) return override.status;
      return initialPRs.find((p) => p.id === prId)?.status;
    },
    [safeStore]
  );

  const unreadCount = useMemo(
    () => safeStore.notifications.filter((n) => !n.read).length,
    [safeStore.notifications]
  );

  const value: UserDataContextValue = {
    profile: safeStore.profile,
    issues: safeStore.issues,
    workflowRuns: safeStore.workflowRuns,
    notifications: safeStore.notifications,
    forks: safeStore.forks,
    watches: safeStore.watches,
    unreadCount,
    updateProfile,
    addIssue,
    closeIssue,
    addCommentToIssue,
    markNotificationRead,
    markAllNotificationsRead,
    toggleFork,
    toggleWatch,
    mergePR,
    getPRStatus,
  };

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  );
}

/* ─── Hook ─── */

export function useUserData(): UserDataContextValue {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
}
