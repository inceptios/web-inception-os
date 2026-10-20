import { SendMessageToWindow } from "./ipcService"

export const SentContextMenuId = (windowId:string, menuId:string)=>{
    SendMessageToWindow(windowId,{
        fun:'CONTEXT_MENU_PRESS_ID',
        payload: {id:menuId}
    })
}