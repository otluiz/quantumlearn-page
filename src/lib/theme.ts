import { useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light" | "neutral";

export const THEMES: { value: Theme; label: string; description: string }[] = [
  { value: "dark", label: "Escuro", description: "Fundo preto, letras claras" },
  { value: "light", label: "Claro", description: "Fundo branco, letras escuras" },
  { value: "neutral", label: "Neutro", description: "Fundo areia, letras escuras" },
];

const STORAGE_KEY = "nl-theme";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.remove("theme-dark", "theme-light", "theme-neutral");
  el.classList.add(`theme-${theme}`);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  const cls = document.documentElement.className;
  if (cls.includes("theme-light")) return "light";
  if (cls.includes("theme-neutral")) return "neutral";
  return "dark";
}

export function useTheme() {
  // Start with "dark" on server to match the SSR class; sync from DOM after mount.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(readInitial());
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
  }, []);

  return { theme, setTheme };
}

/** Inline script injected in <head> to prevent FOUC. */
export const THEME_INIT_SCRIPT = `
(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='neutral'&&t!=='dark')t='dark';document.documentElement.classList.add('theme-'+t);}catch(e){document.documentElement.classList.add('theme-dark');}})();
`.trim();
