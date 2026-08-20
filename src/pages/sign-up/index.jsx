import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import BackButton from "@/components/layout/BackButton";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <BackButton href="/" className="self-start" />

        <Link to="/" className="flex items-center justify-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">DevLink</span>
        </Link>

        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Set up your profile in under two minutes</p>
        </div>

        <Button
          variant="outline"
          className="w-full transition-transform hover:scale-[1.01]"
          onClick={() =>
            toast({
              title: "GitHub sign-up is not available yet",
              description: "Create an account with your email and password for now.",
              variant: "destructive",
            })
          }
        >
          <Github className="mr-2 h-4 w-4" /> Sign up with GitHub
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Jordan Ellis" value={form.name} onChange={update("name")} required autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="jordanellis" value={form.username} onChange={update("username")} required autoComplete="username" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={update("password")}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full btn-gradient shadow-md shadow-primary/25" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
