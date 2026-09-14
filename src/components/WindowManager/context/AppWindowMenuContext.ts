import { createContext, type RefObject } from "react"

export type AppWindowContextType = {    
    onMenuClickRef: RefObject<((clickId: string) => void) | null>;
}

export const AppWindowContext = createContext<AppWindowContextType | null>(null)


