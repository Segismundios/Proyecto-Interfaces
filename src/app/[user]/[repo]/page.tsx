// Client component: useParams (hook de navegación) + useState para el tab
// activo del repo; ambos requieren router context y estado de browser.
"use client";

import { useParams } from "next/navigation";
import { repositories } from "@/data/repos";
import { repoFiles } from "@/data/files";
import { pullRequests } from "@/data/pullRequests";
import { RepoHeader } from "@/components/repo/RepoHeader";
import { FileBrowser } from "@/components/repo/FileBrowser";
import { ReadmePreview } from "@/components/repo/ReadmePreview";
import { Tabs } from "@/components/ui/Tabs";
import { useState } from "react";
import { Code, CircleDot, GitPullRequest, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function RepoPage() {
  const params = useParams();
  const repoName = params.repo as string;
  const userName = params.user as string;
  const [activeTab, setActiveTab] = useState("code");

  const repo = repositories.find((r) => r.name === repoName && r.owner === userName);
  const files = repoFiles[repoName] || [];
  const repoPRs = pullRequests.filter((pr) => pr.repoName === repoName);

  if (!repo) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl text-gh-fg mb-2">Repository not found</h1>
        <p className="text-gh-fg-muted">
          {userName}/{repoName} does not exist.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "code", label: "Code", icon: <Code className="w-4 h-4" /> },
    { id: "issues", label: "Issues", count: 3, icon: <CircleDot className="w-4 h-4" /> },
    { id: "pulls", label: "Pull Requests", count: repoPRs.length, icon: <GitPullRequest className="w-4 h-4" /> },
    { id: "actions", label: "Actions", icon: <Play className="w-4 h-4" /> },
  ];

  return (
    <div>
      <RepoHeader repo={repo} />
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "code" && (
          <>
            <FileBrowser files={files} />
            <ReadmePreview repoName={repo.name} />
          </>
        )}
        {activeTab === "pulls" && (
          <div className="border border-gh-border rounded-md overflow-hidden">
            {repoPRs.length === 0 ? (
              <p className="text-gh-fg-muted text-sm p-4">No pull requests yet.</p>
            ) : (
              repoPRs.map((pr, i) => (
                <div
                  key={pr.id}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-gh-canvas-subtle ${
                    i < repoPRs.length - 1 ? "border-b border-gh-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GitPullRequest
                      className={`w-4 h-4 ${
                        pr.status === "open" ? "text-gh-success" : pr.status === "merged" ? "text-gh-done" : "text-gh-danger"
                      }`}
                    />
                    <div>
                      <Link
                        href={`/${pr.repoOwner}/${pr.repoName}/pull/${pr.id}`}
                        className="text-gh-fg font-semibold text-sm hover:text-gh-accent"
                      >
                        {pr.title}
                      </Link>
                      <p className="text-xs text-gh-fg-muted">
                        #{pr.id} opened by {pr.author} &middot; {pr.headBranch} &rarr; {pr.baseBranch}
                      </p>
                    </div>
                  </div>
                  <Badge variant={pr.status === "open" ? "success" : pr.status === "merged" ? "done" : "danger"}>
                    {pr.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "issues" && (
          <p className="text-gh-fg-muted text-sm p-4 text-center">Issues view (prototype placeholder)</p>
        )}
        {activeTab === "actions" && (
          <p className="text-gh-fg-muted text-sm p-4 text-center">Actions view (prototype placeholder)</p>
        )}
      </div>
    </div>
  );
}
