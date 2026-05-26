import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-8">
      <SettingsSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
