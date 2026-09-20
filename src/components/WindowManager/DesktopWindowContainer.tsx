import { useWindowManagementStore } from '../../stores/windowManagementStore'
import AppWindowNR from './AppWindowNR'
import { systemApps } from '@configs/systemApps'

const DesktopWindowContainer = () => {

  const { activeWindows, setActiveWindow, setWindowState, removeWindow, focusedWindow, setWindowFullScreen } = useWindowManagementStore()

  return (
    <div style={{ 
      position: "relative",
      width:'100%',
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
          onWindowFullScreen={(isFullScreen)=>{setWindowFullScreen(id,isFullScreen)}}
          onClose={() => { removeWindow(id) }}
          windowState={window.windowState}
          menuItems={window.windowMenuItems}
        >{SystemComponent ? <SystemComponent {...window.props}/> :
          "not system"
          }
        </AppWindowNR>
      })}</div>
  )
}

export default DesktopWindowContainer