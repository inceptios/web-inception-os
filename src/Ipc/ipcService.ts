import type { menuItem } from "@configs/osAppStore"
import { useContextMenuStore, type MenuCoordinates } from "../stores/contextMenuStore"

const AppPortsMap: Map<string, MessagePort> = new Map()

export const SendShellHello = (windowId: string, iframeComponent: HTMLIFrameElement) => {
    const url = new URL(iframeComponent.src ?? "").origin
    iframeComponent.contentWindow?.postMessage("SHELL_HELLO_WAIT_FOR_PORT", url)

    const channel = new MessageChannel()
    const port1 = channel.port1
    const port2 = channel.port2

    port1.onmessage = (event: MessageEvent) => {
        ListenSystemPortOnMessage(event, windowId, iframeComponent)
    }
    AppPortsMap.set(windowId, port1)
    iframeComponent.contentWindow?.postMessage("SHELL_HELLO", url, [port2])
}


export const SendMessageToWindow = (windowId:string, payload:unknown)=>{
    const appPort = AppPortsMap.get(windowId)

    if(appPort){
        appPort.postMessage(payload)
    }
}

const ListenSystemPortOnMessage = (event: MessageEvent, windowId: string, iframeComponent: HTMLIFrameElement) => {
    console.log("Port system receiving...", {
        from: windowId,
        message: event.data,
    })
    if (event.data === "FRAME_PORT_HI") {
        AppPortsMap.get(windowId)?.postMessage("SHELL_HI_ACK")
    }
    else {
        const funId = event.data.fun as keyof IPCPayloadMap
        const handler = IPCFunctionsMap[funId]

        handler?.({...event.data.payload,iframeComponent,windowId
        })
    }
}

interface IPCPayloadMap {
    OPEN_CONTEXT_MENU: {
        coordinates: MenuCoordinates,
        menuItems: menuItem[],
        iframeComponent: HTMLIFrameElement,
        windowId:string
    },
    // OS_SET_WINDOW_TITLE: {
    //     title: string;
    // };
}

type IPCFunctionsRegistry = {
    [K in keyof IPCPayloadMap]: (payload: IPCPayloadMap[K]) => void;
};

const IPCFunctionsMap: IPCFunctionsRegistry = {
    OPEN_CONTEXT_MENU: (
        {
            coordinates,
            menuItems,
            iframeComponent,
            windowId
        }: { coordinates: MenuCoordinates, menuItems: menuItem[], iframeComponent: HTMLIFrameElement, windowId:string }
    ) => {
        console.log("getting ocntext menu called")
        const { setMenuCoordinates, setContextMenuItems, setIsContextMenuShown, isContextMenuShown, setIframeId } = useContextMenuStore.getState()
        const iframeX = iframeComponent.getBoundingClientRect().x
        const iframeY = iframeComponent.getBoundingClientRect().y

        const absoluteX = coordinates.x + iframeX
        const absouluteY = coordinates.y + iframeY
        setIframeId(windowId)
        setMenuCoordinates({x:absoluteX, y: absouluteY})
        setContextMenuItems(menuItems)

        setIsContextMenuShown(!isContextMenuShown)

    }
}