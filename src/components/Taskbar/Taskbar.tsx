import './Taskbar.css'
import ReactImg from '../../assets/react.svg'
import { useWindowManagementStore, } from '@configs/windowManagementStore'

const Taskbar = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
    const { activeWindows, setWindowState, setActiveWindow } = useWindowManagementStore()
    return (
        <div id="taskbar">
            <button id='start-button' onClick={onMenuOpen}>
                <img src={ReactImg} />
            </button>
            {activeWindows.map(item => (
                <button className={`start-icons 
                    ${item.active?"task-active":""} 
                    ${item.windowState==="maximised"? "task-maximised":""}`} 
                    key={item.id}
                    onClick={() => {
                        if (item.windowState === "minimised") {
                            setActiveWindow(item.id)
                            setWindowState(item.id, "maximised")
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