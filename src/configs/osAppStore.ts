import fileExplorer from '/file-explorer.svg'
import settingIcon from '/setting.svg'

export type menuItem = {
    menuId: string,
    title: string,
    icon?: string,
    enabled: boolean,
    items?: menuItem[],
}

export type StoreApp = {
    id: string,
    name: string,
    icon: string,
    description: string,
    endPoint?: string,
    isSystemApp: boolean,
    menuItems?: Record<string, menuItem[]>
}

export const OsAppStore: Record<string, StoreApp> = {
    "1": {
        id: "1",
        name: "File Explorer",
        icon: fileExplorer,
        description: "Hand Made Browser based basic file explorer",
        endPoint: "",
        isSystemApp: false,
    },
    "2": {
        id: "system_setting",
        name: "System Setting",
        icon: settingIcon,
        description: "System Setting and some basic things",
        isSystemApp: true,
        menuItems: {
            File: [{
                menuId: "save",
                title: "Save",
                enabled: true,
            }],
            Edit: [{
                menuId: "testing",
                title: "Testing c",
                enabled: true,
            }],
            testing: [
                {
                    menuId: "testing",
                    title: "Testing c",
                    enabled: true,
                }
            ]
        }
    }
} as const