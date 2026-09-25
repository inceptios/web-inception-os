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
        backgroundImage:"url(/wallpaper.jpg)",
        backgroundSize:"cover",
        backgroundRepeat:"no-repeat",
        backgroundPosition:"centre",
        overflow:'hidden'
        }}
        onContextMenu={(e)=>{
            e.preventDefault
        }}
        >
        <main style={{
            flex:1,
            position:'relative'
            }}
            onContextMenu={(e)=>{
                e.preventDefault()
                e.stopPropagation()
            }}
            >
            {children}
        </main>
        <footer style={{padding:'1rem'}}
            onContextMenu={(e)=>{
                e.preventDefault()
                console.log("Disabled for footer")
            }}
        >
            <Taskbar onMenuOpen={onMenuOpen}/>
        </footer>
    </div>
  )
}

export default DesktopLayout