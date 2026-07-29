import { useState } from "react";
import { FolderGit2, BarChart3, Type, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";

const postTypes = [
  { id: "text", label: "Text", icon: Type },
  { id: "project-update", label: "Project update", icon: FolderGit2 },
  { id: "code", label: "Code", icon: Code },
  { id: "poll", label: "Poll", icon: BarChart3 },
];

export default function PostComposer({ onPost, currentUser: user }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [submitting, setSubmitting] = useState(false);
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const displayUser = user || authUser;

  const handleSubmit = async () => {
    if (!content.trim() || !displayUser) return;
    setSubmitting(true);
    try {
      const res = await api.post("/posts", { content: content.trim(), type });
      onPost?.(res.data.post);
      setContent("");
      setType("text");
    } catch (err) {
      toast({ title: "Error", description: "Could not create post.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="space-y-3 p-4">
        <div className="flex gap-3">
          <UserAvatar username={displayUser.username} displayName={displayUser.name} className="h-9 w-9 shrink-0" />
          <Textarea
            placeholder="Share what you're building…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[70px] resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {postTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                  type === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60"
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className={cn(
              "transition-transform",
              content.trim() && !submitting && "hover:scale-105"
            )}
          >
            {submitting ? "Posting…" : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
