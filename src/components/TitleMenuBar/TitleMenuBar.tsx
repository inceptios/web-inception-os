import type { menuItem } from "@configs/osAppStore"

type TitleMenuBarProps = {
    menuItems: Record<string, menuItem[]>,
    onMenuClick: React.RefObject<((id: string) => void) | null>
}

const TitleMenuBar = ({ menuItems, onMenuClick }: TitleMenuBarProps) => {
    return (
        <div>
            {Object.entries(menuItems).map(([id]) => (
                <button key={id} onClick={() => {
                    onMenuClick.current?.(id)
                }}
                >{id}</button>
            ))}
        </div>
    )
}

export default TitleMenuBar