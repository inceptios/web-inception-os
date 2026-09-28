
import { useEffect, useState } from 'react'
import 'web-inception-sdk/style.css'
import './App.css'
import './index.css'
import DesktopLayout from './components/DesktopLayout/DesktopLayout'
import TaskMenu from './components/TaskMenu/TaskMenu'
import DesktopWindowContainer from '@components/WindowManager/DesktopWindowContainer'
import { useThemeStore } from './stores/ThemeStore'
import ContextMenu from '@components/ContextMenu/ContextMenuBackdrop'

function App() {
  const [tastMenuOpen,setTaskMenuOpen] = useState<boolean>(false)
  const {sourceTheme,setActiveTheme} = useThemeStore()

  useEffect(() => {
    console.log("the config apps link", import.meta.env.VITE_CUSTOM_FILE_EXPLORER)

    const savedTheme = localStorage.getItem('theme')
    if(savedTheme){
      setActiveTheme(savedTheme as 'light'|'dark','user')
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applySystemTheme = ()=>{
        setActiveTheme(mediaQuery.matches?"dark" : "light",'system')
        console.log("Theme comming", mediaQuery.matches)
    }
    applySystemTheme()
    const handleChange = () => {
      applySystemTheme()
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [sourceTheme])

  const onClose = () => {
    setTaskMenuOpen(false)
  }

  return (
    <DesktopLayout onMenuOpen={()=>setTaskMenuOpen(!tastMenuOpen)}>
      <TaskMenu menuVisible={tastMenuOpen} onClose={onClose}/>
      <ContextMenu/>
      <DesktopWindowContainer/>
    </DesktopLayout>
  )
}

export default App
