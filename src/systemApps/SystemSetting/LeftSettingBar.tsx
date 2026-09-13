import type { ReactNode } from "react"
import type { SettingScreen, titleType } from "./SystemSetting"
import { MenuButton } from "web-inception-sdk/ui"


type LeftSettingBarProps = {
    settingsOptions: Record<titleType, SettingScreen>,
    currentOption: titleType,
    setCurrentSettingOption: (opt: titleType) => void
}

const LeftSettingBar = ({ settingsOptions, setCurrentSettingOption, currentOption }: LeftSettingBarProps): ReactNode => {
    return (
        <div
            className="left-setting-bar"
        >{
                Object.entries(settingsOptions).map(([id, opt]) => (
                    <MenuButton
                        key={opt.title}
                        onClick={() => { setCurrentSettingOption(id as titleType) }}
                        icon={opt.icon}
                        isCurrent={currentOption === id}
                    >
                        {opt.title}
                    </MenuButton>
                ))
            }
        </div>
    )
}

export default LeftSettingBar