import type { FC } from "react"
import { useThemeStore } from "../../../stores/ThemeStore"

const ThemeSetting : FC= () => {
  const {theme,sourceTheme,setActiveTheme,removePreferedTheme} = useThemeStore()
  return (
    <div>
      <p>Current theme {theme} source {sourceTheme}</p>
      <button onClick={()=>{setActiveTheme('dark','user')}}>darkTheme</button>
      <button onClick={()=>{setActiveTheme('light','user')}}>light theme</button>
      <button onClick={()=>{removePreferedTheme()}}>System</button>
      </div>
  )
}

export default ThemeSetting