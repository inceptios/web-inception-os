import './Taskbar.css'
import ReactImg from '../../assets/react.svg'
import { useWindowManagementStore, } from '../../stores/windowManagementStore'

const Taskbar = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
    const { activeWindows,focusedWindow, setWindowState, setActiveWindow } = useWindowManagementStore()
    return (
        <div id="taskbar">
            <button id='start-button' onClick={onMenuOpen}>
                <img src={ReactImg} />
            </button>
            {Object.entries(activeWindows).map(([id,item]) => (
                <button className={`start-icons 
                    ${id=== focusedWindow? "task-active" : ""} 
                    ${item.windowState === "maximised" ? "task-maximised" : ""}`}
                    key={item.id}
                    onClick={() => {
                        if (item.windowState === "minimised") {
                            setActiveWindow(item.id)
                            setWindowState(item.id, "maximised")
                        }
                        else if(!(id === focusedWindow)){
                            setActiveWindow(item.id)
                        }
                        else {
                            setWindowState(item.id, "minimised")
                        }
                    }}>
                    <img src={item.icon} style={{ width: '1.5rem' }} />{item.name}
                </button>
            ))}
        </div>
    )
}

export default Taskbar