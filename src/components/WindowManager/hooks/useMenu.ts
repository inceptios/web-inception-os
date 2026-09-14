import { use, useEffect, useRef } from "react"
import { AppWindowContext } from "../context/AppWindowMenuContext"

type useMenuType = {
    menuActionMap: Record<string, () => void>
}

export const useMenu = ({ menuActionMap }: useMenuType) => {
    const AppContext = use(AppWindowContext)

    const menuActionRef = useRef<typeof menuActionMap>(menuActionMap)

    useEffect(()=>{
        menuActionRef.current = menuActionMap
    },[menuActionMap])

    useEffect(() => {
        if (AppContext) {
            AppContext.onMenuClickRef.current = (clickId: string) => {
                if (menuActionRef.current[clickId]) {
                    menuActionRef.current[clickId]()
                }
            }
        }
        return () => {
            if (AppContext) {
                AppContext.onMenuClickRef.current = null
            }
        }
    }, [AppContext])
}