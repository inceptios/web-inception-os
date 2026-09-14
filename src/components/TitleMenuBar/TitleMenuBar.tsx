import type { menuItem } from "@configs/osAppStore"
import { useState, type FC } from "react"
import './TitleMenuBar.css'
import { createPortal } from "react-dom"

type TitleMenuBarProps = {
    menuItems: Record<string, menuItem[]>,
    onMenuClick: React.RefObject<((id: string) => void) | null>
}

type menuButtonsRecersiveProps = {
    menuItem: menuItem[],
    onButtonClick: React.RefObject<((id: string) => void) | null>
}

const MenuButtonsRecersive = ({ menuItem, onButtonClick}: menuButtonsRecersiveProps) => {

    const [activeSubMenuId, setActiveSubMenuId] = useState<string | null>(null)



    return (
        <>
            {menuItem.map(item => (
                <div className="sub-menu-overlay">
                    <button
                        key={item.menuId}
                        className= {`title-menu-sub-button`}
                        style={{
                            anchorName: `--sub-menu-btn-${item.menuId}`,
                        }}

                        onPointerEnter={()=>{
                            setActiveSubMenuId(item.menuId)
                        }}

                        onClick={()=>{
                            if(!item.items){
                                onButtonClick.current?.(item.menuId)
                            }
                        }}
                    >
                        {item.title}
                        {item.items && '>'}
                    </button>
                    {item.items && activeSubMenuId === item.menuId && <div
                        className="sub-menu-more-options"
                        style={{
                            position: 'absolute',
                            positionAnchor: `--sub-menu-btn-${item.menuId}`,
                        }}
                    >
                        <MenuButtonsRecersive
                            menuItem={item.items}
                            onButtonClick={onButtonClick}
                        />
                    </div>}
                </div>
            ))}


        </>
    )
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