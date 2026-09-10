import { create } from "zustand"

interface ThemeStore {
    theme: 'light' | 'dark',
    sourceTheme: 'system' | 'user',
    setActiveTheme: (theme: 'light' | 'dark', source: 'system' | 'user') => void,
    removePreferedTheme: () => void,
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: 'light',
    sourceTheme: 'system',
    setActiveTheme: (theme, source) => set(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme)
        if (source === 'user') {
            localStorage.setItem('theme', theme)
        }
        return {
            theme: theme,
            sourceTheme: source
        }
    }),
    removePreferedTheme: () => set(state => {
        localStorage.removeItem('theme')
        return {
            ...state,
            sourceTheme:'system'
        }
    })
}))