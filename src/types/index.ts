export interface User {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
}

export interface Repository {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  visibility: "public" | "private";
  isFavorite: boolean;
  lastAccessed: string;
  updatedAt: string;
}

export interface FileEntry {
  name: string;
  type: "file" | "folder";
  lastCommitMessage: string;
  lastCommitDate: string;
  children?: FileEntry[];
}

export interface PullRequest {
  id: number;
  repoOwner: string;
  repoName: string;
  title: string;
  body: string;
  status: "open" | "merged" | "closed";
  author: string;
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  commits: Commit[];
  reviewers: Reviewer[];
  diffFiles: DiffFile[];
  comments: PRComment[];
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface Reviewer {
  username: string;
  status: "pending" | "approved" | "changes_requested" | "commented";
}

export interface DiffFile {
  filename: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  reviewedBy?: string[];
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

export interface DiffLine {
  type: "addition" | "deletion" | "context";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface PRComment {
  author: string;
  body: string;
  createdAt: string;
  type: "comment" | "review" | "system";
}

export interface IssueComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Issue {
  id: number;
  repoOwner: string;
  repoName: string;
  title: string;
  body: string;
  status: "open" | "closed";
  author: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  comments: IssueComment[];
}

export interface WorkflowRun {
  id: string;
  repoOwner: string;
  repoName: string;
  workflowName: string;
  status: "success" | "failure" | "running" | "cancelled";
  branch: string;
  commit: string;
  commitSha: string;
  author: string;
  /** Duración en segundos (0 si está running) */
  duration: number;
  triggeredAt: string;
}

export interface AppNotification {
  id: string;
  type: "pr" | "issue" | "mention" | "ci";
  title: string;
  body: string;
  repoOwner: string;
  repoName: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  email?: string;
}

export interface PersonalAccessToken {
  id: string;
  name: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  expiresAt: string;
  tokenPreview: string;
}

export interface SSHKey {
  id: string;
  title: string;
  fingerprint: string;
  addedAt: string;
  lastUsed: string;
}
