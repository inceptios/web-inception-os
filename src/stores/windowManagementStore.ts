import type { ActiveWindow, WindowState } from '@components/WindowManager/Types'
import { create } from 'zustand'
import type { menuItem, StoreApp } from '../configs/osAppStore'

export interface taskbarItem {
    id: number,
    icon: string,
    name: string,
}

interface WindowMangementStore {
    activeWindows: Record<string, ActiveWindow>,
    focusedWindow: string,
    addWindow: (win: StoreApp) => void,
    removeWindow: (id: string) => void,
    setActiveWindow: (id: string) => void,
    setWindowState: (id: string, winState: WindowState) => void,
    setWindowMenuItems: (id: string, menuItems: Record<string, menuItem[]>) => void,
}

export const useWindowManagementStore = create<WindowMangementStore>((set) => ({
    activeWindows: {},
    focusedWindow: "",
    addWindow: (win) => set(state => {
        const randomId = Math.random() * 10000
        // const updatedWindows: ActiveWindow[] = state.activeWindows.map(windo => ({ ...windo, active: false }))
        console.log("Adding app ", win)
        return {
            activeWindows: {
                ...state.activeWindows
                , [`${win.id}-${randomId}`]: {
                    id: `${win.id}-${randomId}`,
                    name: win.name,
                    icon: win.icon,
                    active: true,
                    windowState: 'maximised',
                    iframeUrl: win.endPoint ?? "",
                    isSystem: win.isSystemApp,
                    systemComponentId: win.id,
                    windowMenuItems: win.menuItems
                }
            },
            focusedWindow: `${win.id}-${randomId}`
        }
    }),
    removeWindow: (id) => set(state => {
        const { [id]: closedWindow, ...remaining } = state.activeWindows
        const lastWindowId = Object.entries(remaining)[0] ?? ""
        return {
            activeWindows: remaining,
            focusedWindow: lastWindowId[0]??""
        }}),
    setActiveWindow: (id) => set(() => ({
        focusedWindow: id
    })),
    setWindowState: (id, winState) => set(state => ({
        activeWindows: {
            ...state.activeWindows,
            [id]:{
                ...state.activeWindows[id],
                windowState:winState,
            }
        }
    })),
    setWindowMenuItems: (id, menuItems) => set(state => ({
        activeWindows: {
            ...state.activeWindows,
            [id]:{
                ...state.activeWindows[id],
                windowMenuItems:menuItems
            }
        }
    })),
}))