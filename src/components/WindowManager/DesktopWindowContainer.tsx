import { useRef } from 'react'
import { useWindowManagementStore } from '../../stores/windowManagementStore'
import AppWindowNR from './AppWindowNR'
import { systemApps } from '@configs/systemApps'
import { SendShellHello } from '../../Ipc/ipcService'

const DesktopWindowContainer = () => {

  const { activeWindows, setActiveWindow, setWindowState, removeWindow, focusedWindow, setWindowFullScreen } = useWindowManagementStore()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  return (
    <div style={{
      position: "relative",
      width: '100%',
      height: '100%'
    }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {Object.entries(activeWindows).map(([id, window]) => {
        const SystemComponent = window.isSystem && window.systemComponentId ? systemApps[window.systemComponentId] : null


        return <AppWindowNR
          key={window.id}
          title={window.name}
          isActive={id === focusedWindow}
          icon={window.icon}
          onActive={() => setActiveWindow(id)}
          onMinimise={() => setWindowState(id, 'minimised')}
          windowFullScreen={window.windowFullScreen}
          onWindowFullScreen={(isFullScreen) => { setWindowFullScreen(id, isFullScreen) }}
          onClose={() => { removeWindow(id) }}
          windowState={window.windowState}
          menuItems={window.windowMenuItems}
          iframeRef={iframeRef}
        >{SystemComponent ? <SystemComponent {...window.props} windowId={id} /> :
          <iframe
            src={window.iframeUrl}
            sandbox="allow-scripts allow-same-origin"
            ref={iframeRef}
            style={{
              height: '100%',
              boxShadow: 'none',
              border: 'none',
              borderRadius: 'calc( 20px - 0.3rem )'
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onLoad={() => {

              const handleInitBridge = (event: MessageEvent) => {
                console.log("shell message", {
                  from: event.origin,
                  message: event.data
                })
                if (event.origin === window.iframeUrl && event.data === "FRAME_HELLO" && iframeRef.current) {
                  console.log("Sending Shell message")
                  SendShellHello(window.id, iframeRef.current)
                  removeEventListener("message", handleInitBridge)
                }
              }
              addEventListener("message", handleInitBridge)
            }}
          >

          </iframe>
          }
        </AppWindowNR>
      })}</div>
  )
}

export default DesktopWindowContainer