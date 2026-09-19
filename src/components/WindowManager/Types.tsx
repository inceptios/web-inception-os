import type { menuItem } from "@configs/osAppStore"

export type WindowState = "minimised"|"maximised"

export type ActiveWindow={
    id:string,
    name:string,
    icon:string,
    windowState:WindowState,
    iframeUrl?:string,
    isSystem?:boolean,
    systemComponentId?:string,
    windowMenuItems?:Record<string,menuItem[]>,
    props?: object
}