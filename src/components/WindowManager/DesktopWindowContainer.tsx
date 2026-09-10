import { useWindowManagementStore } from '../../stores/windowManagementStore'
import AppWindowNR from './AppWindowNR'
import { systemApps } from '@configs/systemApps'

const DesktopWindowContainer = () => {

  const { activeWindows, setActiveWindow, setWindowState, removeWindow } = useWindowManagementStore()

  return (
    <div style={{ position: "relative" }}>
      {activeWindows.map(window => {
        const SystemComponent = window.isSystem && window.systemComponentId ? systemApps[window.systemComponentId] : null


        return <AppWindowNR
          key={window.id}
          title={window.name}
          isActive={window.active}
          icon={window.icon}
          onActive={() => setActiveWindow(window.id)}
          onMinimise={() => setWindowState(window.id, 'minimised')}
          onClose={() => { removeWindow(window.id) }}
          windowState={window.windowState}
        >{SystemComponent ? <SystemComponent /> :
          "not system"
          }
        </AppWindowNR>
      })}</div>
  )
}

export default DesktopWindowContainer