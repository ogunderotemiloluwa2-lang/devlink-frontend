import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Github, Users, Sparkles, MessageSquare, Globe2, Star, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Users,
    title: "Find collaborators",
    description: "Browse real projects looking for the exact role you play — not a generic job board.",
  },
  {
    icon: Sparkles,
    title: "Discover AI tools",
    description: "A directory of developer tools reviewed by people who actually shipped with them.",
  },
  {
    icon: MessageSquare,
    title: "Talk shop",
    description: "Direct messages and communities built around what you're actively working on.",
  },
  {
    icon: Globe2,
    title: "Build in public",
    description: "Share devlogs, project updates, and lessons learned with people who get it.",
  },
];


export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">DevLink</span>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
            <Button asChild className="btn-gradient shadow-md shadow-primary/25">
              <Link to="/sign-up">Sign up free</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Badge variant="outline" className="w-fit gap-1.5">
              <Github className="h-3 w-3" /> Now with GitHub-style project cards
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Where developers find their next project — and the people building it.
            </h1>
            <p className="max-w-md text-balance text-muted-foreground">
              DevLink is a network for sharing what you're building, finding collaborators for your
              next side project, and discovering the AI tools other engineers actually rely on.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="btn-gradient shadow-md shadow-primary/25">
                <Link to="/sign-up">
                  Create your profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/feed">See the feed</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-xl border border-border bg-secondary/30 font-mono text-xs text-muted-foreground/40">
                <div className="p-4">
                  <span className="text-primary">const</span> <span className="text-foreground">DevLink</span> <span className="text-muted-foreground">=</span> <span className="text-primary">async</span> <span className="text-muted-foreground">() =&gt;</span> <span className="text-muted-foreground">{`{`}</span>
                  <div className="ml-4">
                    <span className="text-primary">const</span> collaborators <span className="text-muted-foreground">=</span> <span className="text-accent-foreground">await</span> findTeam(<span className="text-green-400">"react"</span>, <span className="text-green-400">"designer"</span>);
                  </div>
                  <div className="ml-4">
                    <span className="text-primary">return</span> collaborators.map(<span className="text-accent-foreground">c</span> <span className="text-muted-foreground">=&gt;</span> <span className="text-muted-foreground">{`{`}</span> ...c, matched: <span className="text-green-400">true</span> <span className="text-muted-foreground">{`}`}</span>);
                  </div>
                  <span className="text-muted-foreground">{`}`}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Build in public</p>
                    <p className="text-xs text-muted-foreground">Share devlogs, project updates, and lessons learned</p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                  <Badge variant="secondary" className="text-xs">React</Badge>
                  <Badge variant="secondary" className="text-xs">Node.js</Badge>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">Recent activity</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-5 w-5 rounded bg-muted/30" />
                      <span className="h-3 w-32 rounded bg-muted/30" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-5 w-5 rounded bg-muted/30" />
                      <span className="h-3 w-24 rounded bg-muted/30" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground"><Star className="h-3 w-3" /> 24</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><GitFork className="h-3 w-3" /> 7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container py-20">
          <div className="mb-10 max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tight">Everything around the code, in one place</h2>
            <p className="mt-2 text-muted-foreground">
              Not another social network — a workspace for the parts of being a developer that happen
              outside your editor.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -2 }}
                className="group space-y-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-[18px] w-[18px] text-primary transition-transform group-hover:scale-110" />
                </div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/20">
        <div className="container flex flex-col items-center gap-4 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to build with people who get it?</h2>
          <p className="max-w-md text-muted-foreground">
            Set up your profile in under two minutes. No recruiter spam, no vague "networking."
          </p>
          <Button size="lg" asChild className="btn-gradient shadow-md shadow-primary/25">
            <Link to="/sign-up">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 DevLink</span>
          <div className="flex gap-4">
            <Link to="/sign-in" className="transition-colors hover:text-foreground">Sign in</Link>
            <Link to="/sign-up" className="transition-colors hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
