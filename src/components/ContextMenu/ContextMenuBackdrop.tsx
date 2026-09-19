import { useLayoutEffect, useRef, useState } from 'react'
import './ContextMenuBackdrop.css'
import { defaultContextMenu } from '@configs/systemContext'
import { ContextMenu } from 'web-inception-sdk/ui'
import { useContextMenuActions } from './ContextMenuActions'

type MenuCoordinates = {
    x: number,
    y: number,
}

const ContextMenuBackdrop = () => {

    const [isContextMenuShown, setIsContextMenuShown] = useState<boolean>(false)
    const [menuCoordinates, setMenuCoordinates] = useState<MenuCoordinates>({ x: 10, y: 10 })
    const {contextActions} = useContextMenuActions()

    const contextRef = useRef<HTMLDivElement | null>(null)
    const functionRef = useRef<((id: string) => void) | null>(null)

    useLayoutEffect(() => {
        functionRef.current = (id: string) => { 
            console.log("Getting the string called ", id) 
            contextActions[`${id}`]?.()
        }
        if (!contextRef.current || !isContextMenuShown) return;
        const { offsetWidth, offsetHeight } = contextRef.current
        const { innerHeight, innerWidth } = window
        let safex = menuCoordinates.x
        let safey = menuCoordinates.y

        if (menuCoordinates.x + offsetWidth > innerWidth) {
            safex = menuCoordinates.x - offsetWidth
        }

        if (menuCoordinates.y + offsetHeight > innerHeight) {
            safey = menuCoordinates.y - offsetHeight
        }

        if (safex !== menuCoordinates.x || safey !== menuCoordinates.y) {
            setMenuCoordinates({ x: safex, y: safey })
        }

    }, [isContextMenuShown, menuCoordinates])

    return (
        <div
            id='contextmenu-backdrop'
            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsContextMenuShown(!isContextMenuShown)
                console.log("Getting the context menu called....")
                setMenuCoordinates({ x: e.clientX, y: e.clientY })

            }}
        >
            <div
                id='context-menu-backdrop'
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsContextMenuShown(false)
                }}
            >
            </div>
            <ContextMenu
                isContextMenuShown={isContextMenuShown}
                menuCoordinates={menuCoordinates}
                contextRef={contextRef}
                functionRef={functionRef}
                menuItems={defaultContextMenu}
                onClose={() => {
                    setIsContextMenuShown(false)
                }}
            />
        </div>
    )
}

export default ContextMenuBackdrop