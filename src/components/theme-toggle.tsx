import { Moon, Sun, Palette } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const label = theme === "dark" ? "Usar tema claro" : "Usar tema escuro";
  return (
    <Button variant="ghost" size="icon" type="button" title={label} aria-label={label}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "dark", label: "Escuro", Icon: Moon },
  { value: "light", label: "Claro", Icon: Sun },
  { value: "neutral", label: "Neutro", Icon: Palette },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className="inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-surface/60 p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <Button
            variant="ghost"
            key={value}
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setTheme(value)}
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-red)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {!compact && <span>{label}</span>}
          </Button>
        );
      })}
    </div>
  );
}
