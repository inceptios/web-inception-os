import type { FC, HTMLAttributes } from "react";
import './MenuButton.css'

type MenuButtonType = HTMLAttributes<HTMLButtonElement> & {
    icon:string,
    isCurrent:boolean
}

export const MenuButton: FC<MenuButtonType> = ({ onClick, children,icon, isCurrent, ...props }) => {
    return (
    <button
        onClick={onClick}
        className={`menu-button ${isCurrent?"current-option":""}`}
        {...props}
    >
        <img src={icon} alt="Option image"/><p>{children}</p>
    </button>)
}