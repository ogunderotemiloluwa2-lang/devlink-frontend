import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import BackButton from "@/components/layout/BackButton";
import api from "@/lib/api";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.message || "Could not send reset link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">
        <BackButton href="/sign-in" className="self-start" />

        <Link to="/" className="flex items-center justify-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">DevLink</span>
        </Link>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <MailCheck className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                If an account exists for <strong className="text-foreground">{email}</strong>, we've sent
                a link to reset your password.
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/sign-in">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-semibold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full btn-gradient shadow-md shadow-primary/25" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send reset link
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
