import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = 'dark' | 'light';

const THEME_KEY = 'rasttro:theme';
const CYCLE: ThemePreference[] = ['system', 'light', 'dark'];

const media = window.matchMedia('(prefers-color-scheme: dark)');

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return media.matches ? 'dark' : 'light';
  return preference;
}

function applyThemeToDocument(theme: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function readStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'system' || stored === 'light' || stored === 'dark' ? stored : 'dark';
}

const initialPreference = readStoredPreference();
applyThemeToDocument(resolve(initialPreference));

interface ThemeState {
  preference: ThemePreference;
  theme: ResolvedTheme;
  cycle: () => void;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: initialPreference,
  theme: resolve(initialPreference),
  cycle: () => {
    const next = CYCLE[(CYCLE.indexOf(get().preference) + 1) % CYCLE.length];
    get().setPreference(next);
  },
  setPreference: (preference) => {
    localStorage.setItem(THEME_KEY, preference);
    const theme = resolve(preference);
    applyThemeToDocument(theme);
    set({ preference, theme });
  },
}));

media.addEventListener('change', () => {
  const { preference, setPreference } = useThemeStore.getState();
  if (preference === 'system') setPreference('system');
});
