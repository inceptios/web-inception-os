import { useLayoutEffect, useRef } from 'react'
import './ContextMenuBackdrop.css'
import { defaultContextMenu } from '@configs/systemContext'
import { ContextMenu } from 'web-inception-sdk/ui'
import { useContextMenuActions } from './ContextMenuActions'
import { useContextMenuStore } from '../../stores/contextMenuStore'
import { SentContextMenuId } from '../../Ipc/ipcContextMenu'



const ContextMenuBackdrop = () => {
    const { contextActions } = useContextMenuActions()

    const { isContextMenuShown,
        setIsContextMenuShown,
        menuCoordinates,
        setMenuCoordinates,
        contextMenuItems,
        contextMenuActions,
        iframeId
    } = useContextMenuStore()


    const contextRef = useRef<HTMLDivElement | null>(null)
    const functionRef = useRef<((id: string) => void) | null>(null)

    useLayoutEffect(() => {
        functionRef.current = (id: string) => {
            console.log("Getting the string called ", id)
            if(iframeId){
                SentContextMenuId(iframeId,id)
            }
            else if (contextMenuActions) {
                contextMenuActions[`${id}`]?.()
            }
            else {
                contextActions[`${id}`]?.()
            }
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
            style={{
                zIndex: `${isContextMenuShown ? 999 : 1}`
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
                menuItems={contextMenuItems ?? defaultContextMenu}
                onClose={() => {
                    setIsContextMenuShown(false)
                }}
            />
        </div>
    )
}

export default ContextMenuBackdrop