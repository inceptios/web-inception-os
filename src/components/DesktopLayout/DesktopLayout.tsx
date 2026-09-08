import { type ReactNode } from 'react'
import Taskbar from '../Taskbar/Taskbar'

type DesktopLayoutProps = {
    children:ReactNode,
    onMenuOpen:()=>void,
}

const DesktopLayout = ({children,onMenuOpen}:DesktopLayoutProps) => {
  return (
    <div style={{
        display:'flex', 
        flexDirection:"column", 
        height:"100svh",
        backgroundImage:"url(/wallpaper.jpg)"
        }}>
        <main style={{
            flex:1,
            position:'relative'
            }}>
            {children}
        </main>
        <footer style={{padding:'1rem'}}>
            <Taskbar onMenuOpen={onMenuOpen}/>
        </footer>
    </div>
  )
}

export default DesktopLayout