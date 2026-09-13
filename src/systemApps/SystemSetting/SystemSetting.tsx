
import './SystemSettings.css'
import LeftSettingBar from "./LeftSettingBar"
import { use, useEffect, useState, type FC } from "react"
import ThemeSetting from "./components/ThemeSetting"
import GeneralSetting from "./components/GeneralSetting"
import { Scaffold } from 'web-inception-sdk/ui'
import { useMenu } from '@components/WindowManager/hooks/useMenu'

const settingScreensTitles = {
  theme: "Theme",
  about: "About"
} as const

export type titleType = keyof typeof settingScreensTitles
export type titleNameType = typeof settingScreensTitles[keyof typeof settingScreensTitles]

export type SettingScreen = {
  title: titleNameType,
  component: FC,
  icon: string,
}

const SettingScreens: Record<titleType, SettingScreen> = {
  theme: {
    title: "Theme",
    component: ThemeSetting,
    icon: '/theme-icon.svg'
  },
  about: {
    title: "About",
    component: GeneralSetting,
    icon: '/about-icon.svg',
  },
}


const SystemSetting = () => {
  
  const [settingScreen, setSettingScreen] = useState<titleType>("theme")
  
  const CurrentSettingScreen = SettingScreens[settingScreen].component
    
  const MenuActionMap:Record<string,()=>void> = {
    testing:()=>{
      console.log("Tesing menu from app.",settingScreen)
    },
    openTheme:()=>{
      setSettingScreen("theme")
    }
  }
  
  useMenu({menuActionMap:MenuActionMap})

  return (
    <Scaffold
      classname="scaffold"
      leftSideBar={<LeftSettingBar
        settingsOptions={SettingScreens}
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