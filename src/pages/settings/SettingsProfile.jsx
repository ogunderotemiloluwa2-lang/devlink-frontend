import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { useMyProfile } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";

export default function SettingsProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, refetch } = useMyProfile();

  const [form, setForm] = useState({
    name: "",
    headline: "",
    company: "",
    location: "",
    bio: "",
    about: "",
    openToWork: false,
    openToCollab: true,
  });
  const [stack, setStack] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      const p = data.profile;
      setForm({
        name: data.user?.name || user?.name || "",
        headline: p.headline || "",
        company: p.company || "",
        location: p.location || "",
        bio: p.bio || "",
        about: p.about || "",
        openToWork: p.openToWork || false,
        openToCollab: p.openToCollab !== false,
      });
      setStack(p.skills?.map((s) => s.name) || []);
    }
  }, [data, user?.name]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  const addTech = (e) => {
    e.preventDefault();
    if (!newTech.trim() || stack.includes(newTech.trim())) return;
    setStack((s) => [...s, newTech.trim()]);
    setNewTech("");
  };

  const removeTech = (tech) => setStack((s) => s.filter((t) => t !== tech));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profiles/me", {
        headline: form.headline,
        company: form.company,
        location: form.location,
        bio: form.bio,
        about: form.about,
        openToWork: form.openToWork,
        openToCollab: form.openToCollab,
      });

      // Save tech stack via skills API
      const existingStack = data?.profile?.skills?.map((s) => s.name) || [];
      const toAdd = stack.filter((tech) => !existingStack.includes(tech));
      const toRemove = existingStack.filter((tech) => !stack.includes(tech));

      for (const tech of toAdd) {
        try {
          await api.post("/skills", { name: tech });
        } catch (err) {
          // Skill might already exist or other error — skip
        }
      }
      for (const tech of toRemove) {
        try {
          const skillId = data?.profile?.skills?.find((s) => s.name === tech)?._id;
          if (skillId) await api.delete(`/skills/${skillId}`);
        } catch (err) {
          // Skill might not exist — skip
        }
      }

      setSaved(true);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      refetch();
    } catch (err) {
      toast({ title: "Error", description: "Could not save profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <UserAvatar username={user?.username || ""} displayName={form.name} className="h-16 w-16" textClassName="text-xl" />
          <div>
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-xs text-muted-foreground">
              DevLink generates a color avatar from your username — no upload needed.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={update("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={form.headline} onChange={update("headline")} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={update("company")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={update("location")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={update("bio")} rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about">About</Label>
            <Textarea id="about" value={form.about} onChange={update("about")} rows={4} placeholder="Tell us about yourself…" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.openToWork} onChange={update("openToWork")} />
              Open to work
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.openToCollab} onChange={update("openToCollab")} />
              Open to collaboration
            </label>
          </div>

          <div className="space-y-1.5">
            <Label>Tech stack</Label>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <Badge key={tech} variant="mono" className="gap-1 pr-1">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="rounded-sm hover:bg-foreground/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="Add a technology…"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={addTech}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {saved && <span className="text-xs text-success">Saved</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
