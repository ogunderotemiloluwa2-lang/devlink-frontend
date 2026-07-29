import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const emailPrefs = [
  { id: "new-follower", label: "New followers", description: "When someone follows your profile" },
  { id: "post-engagement", label: "Post likes & comments", description: "When someone interacts with your posts" },
  { id: "collab-invite", label: "Collaboration invites", description: "When you're invited to a project" },
  { id: "messages", label: "Direct messages", description: "When you receive a new message" },
  { id: "digest", label: "Weekly digest", description: "A summary of activity in your network" },
];

const pushPrefs = [
  { id: "push-messages", label: "Direct messages", description: "Get notified instantly on new messages" },
  { id: "push-mentions", label: "Mentions", description: "When someone mentions you in a post or comment" },
];

export default function SettingsNotifications() {
  const [email, setEmail] = useState(
    Object.fromEntries(emailPrefs.map((p) => [p.id, p.id !== "digest"]))
  );
  const [push, setPush] = useState(Object.fromEntries(pushPrefs.map((p) => [p.id, true])));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email notifications</CardTitle>
          <CardDescription>Choose what you'd like to be emailed about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailPrefs.map((pref, i) => (
            <div key={pref.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={pref.id}>{pref.label}</Label>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <Switch
                  id={pref.id}
                  checked={email[pref.id]}
                  onCheckedChange={(checked) => setEmail((prev) => ({ ...prev, [pref.id]: checked }))}
                />
              </div>
              {i < emailPrefs.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Push notifications</CardTitle>
          <CardDescription>Manage real-time alerts on desktop and mobile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushPrefs.map((pref, i) => (
            <div key={pref.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={pref.id}>{pref.label}</Label>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <Switch
                  id={pref.id}
                  checked={push[pref.id]}
                  onCheckedChange={(checked) => setPush((prev) => ({ ...prev, [pref.id]: checked }))}
                />
              </div>
              {i < pushPrefs.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
