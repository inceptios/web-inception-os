
import './SystemSettings.css'
import LeftSettingBar from "./LeftSettingBar"
import { useState, type FC } from "react"
import ThemeSetting from "./components/ThemeSetting"
import GeneralSetting from "./components/GeneralSetting"
import { Scaffold } from 'web-inception-sdk/ui'
import ThemeIcon from '@assets/theme-icon.svg'
import AboutIcons from '@assets/about-icon.svg'

const settingScreensTitles = {
  theme: "theme",
  general: "general"
} as const

export type titleType = keyof typeof settingScreensTitles

export type SettingScreen = {
  title: titleType,
  component: FC,
  icon:string,
}

const SettingScreens: Record<titleType, SettingScreen> = {
  general: {
    title: "general",
    component: GeneralSetting,
    icon: AboutIcons,
  },
  theme: {
    title: "theme",
    component: ThemeSetting,
    icon: ThemeIcon
  },
}

const SystemSetting = () => {

  const [settingScreen, setSettingScreen] = useState<titleType>("theme")

  const CurrentSettingScreen = SettingScreens[settingScreen].component
  
  return (   
    <Scaffold
      classname="scaffold"
      leftSideBar={<LeftSettingBar
        settingsOptions={Object.values(SettingScreens)}
        setCurrentSettingOption={(opt: titleType) => { setSettingScreen(opt) }}
        currentOption={settingScreen}
      />}
      defaultLeftWidht={200}
    >
      <CurrentSettingScreen />
    </Scaffold>
  )
}

export default SystemSetting