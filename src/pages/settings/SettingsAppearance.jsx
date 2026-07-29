import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const themeOptions = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Laptop },
];

export default function SettingsAppearance() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Theme</CardTitle>
        <CardDescription>Choose how DevLink looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border px-4 py-5 text-sm font-medium transition-colors",
                theme === opt.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              <opt.icon className="h-5 w-5" />
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          DevLink defaults to dark mode. Your preference is saved and persists across visits.
        </p>
      </CardContent>
    </Card>
  );
}
