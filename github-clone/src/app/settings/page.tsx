import { currentUser } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gh-fg">Profile Settings</h1>

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
    </div>
  );
}
