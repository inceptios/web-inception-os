import { OsAppStore, } from "@configs/osAppStore"
import { useWindowManagementStore } from "../../stores/windowManagementStore"

export const useContextMenuActions = ():{contextActions:Record<string, ()=>void >} => {

    const { addWindow } = useWindowManagementStore()

    return {
        contextActions: {
            "setting-theme": () => {
                const systemSetting = OsAppStore[2]
                addWindow(systemSetting, { "staringScreen": "theme" })
            },
            "about": ()=>{
                const system_setting = OsAppStore[2]
                addWindow(system_setting, {"startingScreen": "about"})
            }
        }
    }
}