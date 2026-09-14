import type { menuItem } from "@configs/osAppStore"
import { useState } from "react"
import './TitleMenuBar.css'
import { MenuButtonsRecersive } from "web-inception-sdk/ui"

type TitleMenuBarProps = {
    menuItems: Record<string, menuItem[]>,
    onMenuClick: React.RefObject<((id: string) => void) | null>
}


const TitleMenuBar = ({ menuItems, onMenuClick }: TitleMenuBarProps) => {
    const [isMenuActive, setIsMenuActive] = useState<boolean>(false)
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const handlePointerDown = (id: string) => {
        setIsMenuActive(!isMenuActive)
        setActiveMenuId(id)
    }

    const handlePointerEnter = (id: string) => {
        if (isMenuActive) {
            setActiveMenuId(id)
        }
    }

    return (
        <div className="title-menu-bar"
        >
            {Object.entries(menuItems).map(([id, menuItem]) => (
                <div className="menu-overlay" key={id}>

                    <button key={id}
                        onPointerDown={() => { handlePointerDown(id) }}
                        onPointerEnter={() => { handlePointerEnter(id) }}
                        className={`title-menu-button ${isMenuActive && activeMenuId === id ? "btn-hover" : ""}`}
                        style={{ anchorName: `--menu-btn-${id}` }}
                    >{id}</button>

                    {isMenuActive && activeMenuId === id && <div
                        style={{
                            position: 'absolute',
                            positionAnchor: `--menu-btn-${id}`,
                        }}
                        className="title-menu-dropdown"
                    >
                        <MenuButtonsRecersive
                            menuItem={menuItem}
                            onButtonClick={onMenuClick}
                        />
                    </div>}

                </div>

            ))}
        </div>
    )
}

export default TitleMenuBar