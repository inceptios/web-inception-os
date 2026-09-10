import type { ReactNode } from "react"
import type { SettingScreen, titleType } from "./SystemSetting"
import { MenuButton } from "./contributionComponents/MenuButton.tsx/MenuButton"

type LeftSettingBarProps = {
    settingsOptions: SettingScreen[],
    currentOption:titleType,
    setCurrentSettingOption: (opt: titleType) => void
}

const LeftSettingBar = ({ settingsOptions, setCurrentSettingOption,currentOption }: LeftSettingBarProps): ReactNode => {
    return (
        <div
            style={{ borderRight: 'solid 2px black' }}
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