import { currentUser } from "@/data/users";
import { tokens } from "@/data/tokens";
import { sshKeys } from "@/data/sshKeys";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Key, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gh-fg">Profile Settings</h1>

      {/* Profile section */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="lg" />
          <div>
            <p className="text-lg font-semibold text-gh-fg">{currentUser.displayName}</p>
            <p className="text-sm text-gh-fg-muted">@{currentUser.username}</p>
            <p className="text-sm text-gh-fg-muted mt-1">{currentUser.bio}</p>
          </div>
        </div>
      </Card>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/settings/tokens">
          <Card className="hover:border-gh-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-gh-accent" />
              <h3 className="font-semibold text-gh-fg">Access Tokens</h3>
            </div>
            <p className="text-sm text-gh-fg-muted mb-3">
              Manage your personal access tokens for API and CLI authentication.
            </p>
            <div className="flex items-center gap-2 text-xs text-gh-success">
              <CheckCircle className="w-3.5 h-3.5" />
              {tokens.length} active tokens
            </div>
          </Card>
        </Link>

        <Link href="/settings/ssh-keys">
          <Card className="hover:border-gh-accent/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-gh-accent" />
              <h3 className="font-semibold text-gh-fg">SSH Keys</h3>
            </div>
            <p className="text-sm text-gh-fg-muted mb-3">
              Manage SSH keys for secure Git operations without passwords.
            </p>
            <div className="flex items-center gap-2 text-xs text-gh-success">
              <CheckCircle className="w-3.5 h-3.5" />
              {sshKeys.length} keys configured
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
