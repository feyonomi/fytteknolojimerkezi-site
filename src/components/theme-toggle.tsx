"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolvedTheme: Theme = systemDark ? "dark" : "light";
      setTheme(resolvedTheme);
      applyTheme(resolvedTheme);
    }
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <button className="btn-secondary text-sm" aria-label="Tema değiştir" type="button">
        Tema
      </button>
    );
  }

  return (
    <button className="btn-secondary text-sm" onClick={handleToggle} aria-label="Tema değiştir" type="button">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
