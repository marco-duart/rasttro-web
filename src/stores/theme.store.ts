import { create } from 'zustand';

type Theme = 'dark' | 'light';

const THEME_KEY = 'rasttro:theme';

function applyThemeToDocument(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

const initial: Theme = (localStorage.getItem(THEME_KEY) as Theme | null) ?? 'dark';
applyThemeToDocument(initial);

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial,
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyThemeToDocument(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToDocument(theme);
    set({ theme });
  },
}));
