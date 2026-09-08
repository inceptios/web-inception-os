
import { useEffect, useState } from 'react'
import './App.css'
import DesktopLayout from './components/DesktopLayout/DesktopLayout'
import TaskMenu from './components/TaskMenu/TaskMenu'
import DesktopWindowContainer from '@components/WindowManager/DesktopWindowContainer'

function App() {
  const [tastMenuOpen,setTaskMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    console.log("the config apps link", import.meta.env.VITE_CUSTOM_FILE_EXPLORER)
  }, [])

  const onClose = () => {
    setTaskMenuOpen(false)
  }

  return (
    <DesktopLayout onMenuOpen={()=>setTaskMenuOpen(!tastMenuOpen)}>
      <TaskMenu menuVisible={tastMenuOpen} onClose={onClose}/>
      <DesktopWindowContainer/>
    </DesktopLayout>
  )
}

export default App
