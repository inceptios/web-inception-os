import type { menuItem } from "@configs/osAppStore";
import { create } from "zustand";

export type MenuCoordinates = {
    x: number,
    y: number,
}

export interface ContextMenuStore {
    isContextMenuShown: boolean,
    setIsContextMenuShown: (isShown: boolean) => void,
    menuCoordinates: MenuCoordinates,
    setMenuCoordinates: (menuCoordinates: MenuCoordinates) => void,
    contextMenuItems: menuItem[] | null,
    contextMenuActions: Record<string, () => void> | null,
    setContextMenuActions: (actions: Record<string, () => void>) => void,
    setContextMenuItems: (menuItems: menuItem[]) => void
}

export const useContextMenuStore = create<ContextMenuStore>((set) => ({
    isContextMenuShown: false,
    setIsContextMenuShown: (isShown: boolean) => {
        if (isShown) {
            set({
                isContextMenuShown: isShown
            })
        }
        else {
            set({
                isContextMenuShown:isShown,
                contextMenuActions:null,
                contextMenuItems: null
            })
        }
    },
    menuCoordinates: { x: 0, y: 0 },
    setMenuCoordinates: (menuCoordiates: MenuCoordinates) => {
        set({
            menuCoordinates: menuCoordiates
        })
    },
    contextMenuItems: null,
    setContextMenuItems: (menuItems) => {
        set({
            contextMenuItems: menuItems
        })
    },
    contextMenuActions: null,
    setContextMenuActions: (actions: Record<string, () => void>) => {
        set({
            contextMenuActions: actions
        })
    }
}))