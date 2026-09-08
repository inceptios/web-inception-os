import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import './AppWindow.css'

type AppWindowProps = {
    children: ReactNode,
    title: string,
    isActive: boolean,
    icon?: string
}

type WindowPosition = {
    x: number,
    y: number,
}

const AppWindow = ({ children, title, isActive, icon }: AppWindowProps) => {
    const [windowPosition, setWindowPosition] = useState<WindowPosition>({
        x: 20,
        y: 80,
    })

    const isDragging = useRef<boolean>(false)
    const startingPosition = useRef<WindowPosition>({
        x: 0, y: 0
    })

    useLayoutEffect(() => {
        const handleWindowMove = (e: MouseEvent) => {
            if (!isDragging.current) {
                return
            }
            const userPosition = {
                x: e.clientX,
                y: e.clientY
            }
            setWindowPosition({
                x: userPosition.x - startingPosition.current.x,
                y: userPosition.y - startingPosition.current.y,
            })
        }

        const handleMouseUp = ()=>{
            isDragging.current = false
        }

        addEventListener('pointermove', handleWindowMove)
        addEventListener('pointerup', handleMouseUp)

        return () => {
            removeEventListener('pointermove', handleWindowMove)
            removeEventListener('pointerup', handleMouseUp)
        }
    }, [])

    return (
        <div
            className='app-window'
            style={{
                transform:`translate(${windowPosition.x}px, ${windowPosition.y}px)`,
                width: '600px',
                height: '200px'
            }}

        >
            <div
                className='app-title'
                onPointerDown={(e) => {
                    startingPosition.current = {
                        x: e.clientX - windowPosition.x,
                        y: e.clientY - windowPosition.y,
                    }
                    isDragging.current = true
                }}
            // onMouseUp={() => {
            //     isDragging.current=false
            // }}
            // onMouseLeave={()=>{
            //     isDragging.current=false
            // }}
            >
                Positions : {windowPosition.x} : {windowPosition.y}
                {icon !== "" && <img src={icon} />}
                <p>{title}</p>
                {isActive ? "WindowActive" : "Window out of focus"}
            </div>
            <div className='app-body'>
                {children}
            </div>

        </div >
    )
}

export default AppWindow