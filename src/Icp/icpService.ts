const AppPortsMap: Map<string, MessagePort>= new Map()

export const SendShellHello=(windowId:string, iframeComponent: HTMLIFrameElement)=>{
    const url = new URL(iframeComponent.src ?? "").origin
    iframeComponent.contentWindow?.postMessage("SHELL_HELLO_WAIT_FOR_PORT", url)

    const channel = new MessageChannel()
    const port1 = channel.port1
    const port2 = channel.port2

    port1.onmessage = (event: MessageEvent)=>{
        ListenSystemPortOnMessage(event,windowId)
    }
    AppPortsMap.set(windowId,port1)
    iframeComponent.contentWindow?.postMessage("SHELL_HELLO", url,[port2])
}

const ListenSystemPortOnMessage = (event: MessageEvent,windowId: string)=>{
    console.log("Port system receiving...",{
        from: windowId,
        message: event.data,
    })
    if(event.data === "FRAME_PORT_HI"){
        AppPortsMap.get(windowId)?.postMessage("SHELL_HI_ACK")
    } 
}