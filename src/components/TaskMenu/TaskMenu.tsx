import { useEffect, useState, type ReactNode } from 'react'
import './TaskMenu.css'
import { OsAppStore } from '@configs/osAppStore'
import { useWindowManagementStore } from '@configs/windowManagementStore'

type TaskMenuProps = {
    menuVisible:boolean,
    onClose: () => void
}

const TaskMenu = ({ menuVisible,onClose }: TaskMenuProps): ReactNode => {
    const [isRendered, setIsRendered] = useState<boolean>(menuVisible)
    const [isAnimated, setIsAnimated] = useState<boolean>(false)
    const AppsArray = Object.entries(OsAppStore)
    const { addWindow } = useWindowManagementStore()


    useEffect(()=>{
        if(menuVisible){
            setIsRendered(true);
            setTimeout(() => {
                setIsAnimated(true)
            }, 20);
        }
        else{
            setIsAnimated(false)
        }
    },[menuVisible])

    if(!isRendered) return null;

    return (
        <>
            <div
                id="task-menu-div"
            >
                <div id="task-menu"
                    className={`${isAnimated?"menu-visible":"menu-hidden"}`}
                    onTransitionEnd={()=>{
                        if(!menuVisible){
                            setIsRendered(false)
                        }
                    }}
                >
                    <div
                        id='task-menu-grid'>
                        {AppsArray.map(([id, app]) => {
                            return <button
                                key={id}
                                className='menu-button'
                                onClick={() => {
                                    onClose()
                                    addWindow(app)
                                }
                                }
                            >
                                <img className="menu-btn-img" src={app.icon} />
                                {app.name}
                            </button>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskMenu