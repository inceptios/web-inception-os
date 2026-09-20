import { Activity, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import './AppWindow.css'
import type { WindowState } from './Types'
import { AppWindowContext } from './context/AppWindowMenuContext'
import TitleMenuBar from '@components/TitleMenuBar/TitleMenuBar'
import type { menuItem } from '@configs/osAppStore'

type AppWindowNRProps = {
    children: ReactNode,
    title: string,
    isActive: boolean,
    icon?: string,
    windowState: WindowState,
    menuItems?: Record<string, menuItem[]>
    windowFullScreen?: boolean,
    onWindowFullScreen: (isFullscreen: boolean) => void,
    onActive: () => void,
    onMinimise: () => void,
    onClose: () => void,
}

type WindowPosition = {
    x: number,
    y: number,
}
type WindowSize = {
    width: number,
    height: number,
}

const AppWindowNR = ({ children, title, isActive, icon, onActive, windowState, onMinimise, onClose, menuItems, windowFullScreen, onWindowFullScreen }: AppWindowNRProps) => {
    const [windowPosition, setWindowPosition] = useState<WindowPosition>({
        x: 20,
        y: 80,
    })

    const [windowSize, setWindowSize] = useState<WindowSize>({ width: 600, height: 200 })
    const [renderFullScreen, setRenderFullScreen] = useState<boolean>(false)

    const isDragging = useRef<boolean>(false)
    const [isStateDraggin, setIsStateDraggin] = useState<Boolean>(false)
    const isResizing = useRef<boolean>(false)
    const selectedCorner = useRef<string>("")
    const startingWindowPosition = useRef<WindowPosition>({
        x: 0, y: 0
    })
    const startingPosition = useRef<WindowPosition>({
        x: 0, y: 0
    })
    const menuFunctionRef = useRef<((id: string) => void) | null>(null);

    const startingSize = useRef<WindowSize>({
        width: 0, height: 0
    })

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        startingPosition.current = {
            x: e.clientX - windowPosition.x,
            y: e.clientY - windowPosition.y,
        }

        isDragging.current = true
        setIsStateDraggin(true)

        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerDownResize = (e: PointerEvent<HTMLDivElement>, corner: string) => {
        startingPosition.current = {
            x: e.clientX,
            y: e.clientY,
        }
        startingWindowPosition.current = windowPosition;
        startingSize.current = windowSize

        isResizing.current = true
        selectedCorner.current = corner
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMoveResizing = (e: PointerEvent<HTMLDivElement>) => {
        if (!isResizing.current) return;

        const deltaX = e.clientX - startingPosition.current.x;
        const deltaY = e.clientY - startingPosition.current.y;

        let newWidth = startingSize.current.width;
        let newHeight = startingSize.current.height;
        let newX = startingWindowPosition.current.x;
        let newY = startingWindowPosition.current.y;

        if (selectedCorner.current.includes('e')) {
            // East (Right side): Dragging right increases width
            newWidth = startingSize.current.width + deltaX;
        }
        if (selectedCorner.current.includes('s')) {
            // South (Bottom side): Dragging down increases height
            newHeight = startingSize.current.height + deltaY;
        }
        if (selectedCorner.current.includes('w')) {
            // West (Left side): Dragging left increases width AND moves X left
            newWidth = startingSize.current.width - deltaX;
            newX = startingWindowPosition.current.x + deltaX;
        }
        if (selectedCorner.current.includes('n')) {
            // North (Top side): Dragging up increases height AND moves Y up
            newHeight = startingSize.current.height - deltaY;
            newY = startingWindowPosition.current.y + deltaY;
        }

        // console.log("Height wdith", { newWidth, newHeight, newX, newY })
        // Apply your min-width/min-height constraints here before setting state
        if (newHeight >= 200 && newWidth >= 400) {
            setWindowSize({ width: Math.max(400, newWidth), height: Math.max(200, newHeight) });
            setWindowPosition({ x: newX, y: newY })
        };
    }

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;

        const windowDimensions = {
            x: innerWidth - windowSize.width,
            y: innerHeight - windowSize.height,
        }
        // console.log("window dimensions", windowDimensions)
        // console.log("Positions Setting", e.clientX - startingPosition.current.x, e.clientY - startingPosition.current.y)

        setWindowPosition({
            x: Math.max(0, Math.min(windowDimensions.x, e.clientX - startingPosition.current.x)),
            y: Math.max(0, Math.min(windowDimensions.y, e.clientY - startingPosition.current.y)),
        })
    }

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
        isDragging.current = false
        setIsStateDraggin(false)
        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    const handlePointerUpResize = (e: PointerEvent<HTMLDivElement>) => {
        isResizing.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    const onFullScreen = (isFullScreen: boolean) => {
        // setWindowPosition({x:0,y:0})
        onWindowFullScreen(isFullScreen)
        if(isFullScreen){
            setRenderFullScreen(true)
        }
        else{setTimeout(() => {
            setRenderFullScreen(false)
        }, 200)}
    }

    return (
        <AppWindowContext value={{ onMenuClickRef: menuFunctionRef }}>
            <Activity mode={`${windowState === "maximised" ? 'visible' : 'hidden'}`}>
                {isActive && <title>{title}</title>}
                <div
                    className={`app-window ${isActive ? 'windowActive' : ''} ${renderFullScreen ? 'window-fullscreen-animate' : ''}`}
                    style={{
                        transform: `translate(${windowFullScreen ? '0' : windowPosition.x}px, ${windowFullScreen ? '0' : windowPosition.y}px)`,
                        width: windowFullScreen ? 'calc( 100% - 0.7rem )' : `${windowSize.width}px`,
                        height: windowFullScreen ? '99%' : `${windowSize.height}px`
                    }}
                    onMouseDown={() => {
                        if (!isActive) {
                            onActive()
                        }
                    }
                    }
                // onPointerEnter={() => {
                //     if (!isActive) {
                //         onActive()
                //     }
                // }}
                >
                    {!windowFullScreen && <><div
                        className='dimension-se'
                        onPointerDown={(e) => handlePointerDownResize(e, "se")}
                        onPointerMove={handlePointerMoveResizing}
                        onPointerUp={handlePointerUpResize}
                    >
                    </div>
                        <div
                            className='dimension-e'
                            onPointerDown={(e) => handlePointerDownResize(e, "e")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-sw'
                            onPointerDown={(e) => handlePointerDownResize(e, "sw")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-w'
                            onPointerDown={(e) => handlePointerDownResize(e, "w")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-ne'
                            onPointerDown={(e) => handlePointerDownResize(e, "ne")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-n'
                            onPointerDown={(e) => handlePointerDownResize(e, "n")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-nw'
                            onPointerDown={(e) => handlePointerDownResize(e, "nw")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                        <div className='dimension-s'
                            onPointerDown={(e) => handlePointerDownResize(e, "s")}
                            onPointerMove={handlePointerMoveResizing}
                            onPointerUp={handlePointerUpResize}
                        >
                        </div>
                    </>}

                    <div
                        className={`app-title`}

                    >
                        <div
                            className={`drag-window ${windowFullScreen ? "" : isStateDraggin ? 'grabing' : 'grab'}`}
                            onPointerDown={(e) => {
                                if (windowFullScreen) return
                                handlePointerDown(e)
                            }}
                            onPointerUp={handlePointerUp}
                            onPointerMove={handlePointerMove}
                            onPointerLeave={handlePointerUp}
                        >
                            {icon !== "" && <img src={icon} width={24} height={24} />}
                            <p className='app-title-name'>{title}</p>
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                        <div className='window-buttons'>
                            <button
                                className={`window-button ${isActive ? "minimise" : ""}`}
                                onClick={
                                    () => {
                                        console.log("onMInimize")
                                        onMinimise()
                                    }
                                }
                            >
                                -
                            </button>
                            <button
                                className={`window-button ${isActive ? "maximise" : ""}`}
                                onClick={
                                    () => {
                                        onFullScreen(!windowFullScreen)
                                    }
                                }
                            >
                                🗖
                            </button>
                            <button
                                className={`window-button ${isActive ? "close" : ""}`}
                                onClick={() => {
                                    console.log("ON close")
                                    onClose()
                                }}
                            >
                                x
                            </button>
                        </div>
                    </div>
                    <div>
                        {menuItems && <TitleMenuBar menuItems={menuItems} onMenuClick={menuFunctionRef} />}
                    </div>
                    <div className='app-body'>
                        {children}
                    </div>

                </div >
            </Activity>
        </AppWindowContext>
    )
}

export default AppWindowNR