// Client component: formulario editable de perfil con useState + UserDataContext;
// la mutación (updateProfile) y el loading state requieren browser.
"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/components/ui/Toast";
import { User, MapPin, Mail, Loader2, Check } from "lucide-react";

export default function SettingsPage() {
  const { profile, updateProfile } = useUserData();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) {
      newErrors.displayName = "El nombre no puede estar vacío.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El correo no tiene un formato válido.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      email: email.trim(),
    });
    setSaving(false);
    setSaved(true);
    toast({ title: "Perfil actualizado", variant: "success" });
    setTimeout(() => setSaved(false), 2000);
  }

  const isDirty =
    displayName !== profile.displayName ||
    bio !== profile.bio ||
    location !== (profile.location ?? "") ||
    email !== (profile.email ?? "");

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold text-gh-fg">Profile Settings</h1>

      {/* Avatar + username (read-only) */}
      <div className="flex items-center gap-4 p-4 border border-gh-border rounded-md bg-gh-canvas-subtle">
        <Avatar src={profile.avatarUrl} alt={profile.displayName} size="lg" />
        <div>
          <p className="text-base font-semibold text-gh-fg">{profile.displayName}</p>
          <p className="text-sm text-gh-fg-muted">@{profile.username}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-4">

        {/* Display name */}
        <div>
          <label htmlFor="profile-name" className="flex items-center gap-1.5 text-sm text-gh-fg mb-1.5">
            <User className="w-3.5 h-3.5 text-gh-fg-muted" />
            Nombre
          </label>
          <input
            id="profile-name"
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: "" })); }}
            disabled={saving}
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? "name-error" : undefined}
            className={`w-full bg-gh-canvas border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 ${
              errors.displayName ? "border-gh-danger" : "border-gh-border"
            }`}
          />
          {errors.displayName && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-gh-danger">
              {errors.displayName}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="profile-bio" className="block text-sm text-gh-fg mb-1.5">
            Bio
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={saving}
            rows={3}
            placeholder="Cuéntanos algo sobre ti…"
            className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="profile-location" className="flex items-center gap-1.5 text-sm text-gh-fg mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-gh-fg-muted" />
            Ubicación
          </label>
          <input
            id="profile-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={saving}
            placeholder="Ciudad, País"
            className="w-full bg-gh-canvas border border-gh-border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="profile-email" className="flex items-center gap-1.5 text-sm text-gh-fg mb-1.5">
            <Mail className="w-3.5 h-3.5 text-gh-fg-muted" />
            Correo público
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
            disabled={saving}
            placeholder="tu@ejemplo.cl"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full bg-gh-canvas border rounded-md px-3 py-2 text-sm text-gh-fg placeholder:text-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent focus:border-gh-accent disabled:opacity-50 ${
              errors.email ? "border-gh-danger" : "border-gh-border"
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-gh-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !isDirty}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando…
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Guardado
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
        {isDirty && !saving && (
          <Button
            onClick={() => {
              setDisplayName(profile.displayName);
              setBio(profile.bio);
              setLocation(profile.location ?? "");
              setEmail(profile.email ?? "");
              setErrors({});
            }}
          >
            Descartar cambios
          </Button>
        )}
      </div>
    </div>
  );
}
