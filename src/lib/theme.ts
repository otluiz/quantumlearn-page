import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light" | "neutral";

export const THEMES: { value: Theme; label: string; description: string }[] = [
  { value: "dark", label: "Escuro", description: "Fundo preto, letras claras" },
  { value: "light", label: "Claro", description: "Fundo branco, letras escuras" },
  { value: "neutral", label: "Neutro", description: "Fundo areia, letras escuras" },
];

const STORAGE_KEY = "nl-theme";
const CHANGE_EVENT = "nl-theme-change";

export function resolveTheme(value: unknown): Theme {
  return value === "light" || value === "neutral" ? value : "dark";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.classList.remove("theme-dark", "theme-light", "theme-neutral");
  el.classList.add(`theme-${theme}`);
  window.dispatchEvent(new Event(CHANGE_EVENT));
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

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      applyTheme(resolveTheme(event.newValue));
    }
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readInitial, () => "dark" as Theme);
  return { theme, setTheme: applyTheme };
}

/** Inline script injected in <head> to prevent FOUC. */
export const THEME_INIT_SCRIPT = `
(function(){var t='dark';try{t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='neutral'&&t!=='dark')t='dark';}catch(e){}document.documentElement.classList.remove('theme-dark','theme-light','theme-neutral');document.documentElement.classList.add('theme-'+t);})();
`.trim();
