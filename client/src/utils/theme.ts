import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('sahkari_theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

export function applyTheme(mode: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;
  const root = document.documentElement;
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
    document.body.classList.add('dark');
    document.body.style.backgroundColor = '#0b0f19';
    document.body.style.color = '#f8fafc';
  } else {
    root.classList.remove('dark');
    document.body.classList.remove('dark');
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
  }

  localStorage.setItem('sahkari_theme', mode);
  window.dispatchEvent(new CustomEvent('sahkari_theme_change', { detail: { mode, isDark } }));
  return isDark;
}

export function initTheme(): void {
  if (typeof window === 'undefined') return;
  const mode = getStoredTheme();
  applyTheme(mode);

  // Listen for system theme changes if set to system
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const t = getStoredTheme();
    return (
      t === 'dark' ||
      (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setThemeState(e.detail.mode);
      setIsDark(e.detail.isDark);
    };

    window.addEventListener('sahkari_theme_change', handleThemeChange);
    return () => window.removeEventListener('sahkari_theme_change', handleThemeChange);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    const darkApplied = applyTheme(newTheme);
    setThemeState(newTheme);
    setIsDark(darkApplied);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return { theme, isDark, setTheme, toggleTheme };
}
