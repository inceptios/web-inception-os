import type { ReactNode } from "react"
import type { SettingScreen, titleType } from "./SystemSetting"
import { MenuButton } from "web-inception-sdk/ui"


type LeftSettingBarProps = {
    settingsOptions: SettingScreen[],
    currentOption:titleType,
    setCurrentSettingOption: (opt: titleType) => void
}

const LeftSettingBar = ({ settingsOptions, setCurrentSettingOption,currentOption }: LeftSettingBarProps): ReactNode => {
    return (
        <div
            className="left-setting-bar"
        >{
                settingsOptions.map(opt => (
                    <MenuButton
                        key={opt.title}
                        onClick={() => { setCurrentSettingOption(opt.title) }}
                        icon={opt.icon}
                        isCurrent={currentOption === opt.title}
                    >
                        {opt.title}
                    </MenuButton>
                ))
            }
        </div>
    )
}

export default LeftSettingBar