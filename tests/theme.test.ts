import { expect, test } from "bun:test";
import { resolveTheme, THEME_INIT_SCRIPT } from "../src/lib/theme";

test("theme defaults to dark for missing or invalid saved choices", () => {
  expect(resolveTheme(null)).toBe("dark");
  expect(resolveTheme("invalid")).toBe("dark");
});

test("explicit light and neutral choices are preserved", () => {
  expect(resolveTheme("light")).toBe("light");
  expect(resolveTheme("neutral")).toBe("neutral");
});

test("initialization uses nl-theme, defaults dark and survives unavailable storage", () => {
  for (const saved of [null, "invalid", "dark", "light", "neutral", "blocked"]) {
    const classes = new Set<string>(["theme-light"]);
    const run = new Function("document", "localStorage", THEME_INIT_SCRIPT);
    run({ documentElement: { classList: {
      remove: (...values: string[]) => values.forEach(value => classes.delete(value)),
      add: (value: string) => classes.add(value),
    } } }, { getItem: (key: string) => {
      expect(key).toBe("nl-theme");
      if (saved === "blocked") throw new Error("Storage unavailable");
      return saved;
    } });
    expect([...classes]).toEqual([`theme-${resolveTheme(saved)}`]);
  }
});