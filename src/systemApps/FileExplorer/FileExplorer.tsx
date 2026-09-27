import { useEffect, useState, type FC } from "react"
import { filesDatabase } from "../../database/filesDatabase"
import { resolvePath, useFileExplorerStore } from "../../stores/fileExplorerStore"
import type { SystemAppsPros } from "@configs/systemApps"
import { initFileDatabase } from "../../database/files.instance"
import type { fileNode } from "../../database/files.types"
import type { breadcrumb } from "./FileExplorer.types"

const FileExplorer: FC<SystemAppsPros> = ({windowId}) => {
    const [fileStats,setFileStatus] = useState<boolean>(false)
    const [nodeName,setNodeName] = useState<string>("")
    const windowState= useFileExplorerStore((state)=>state.windowFolderMap[windowId])
    const windowFiles = useFileExplorerStore(
    (state) => windowState?.currentFolderId ? state.folderMap[windowState.currentFolderId] : undefined
) || [];
    const {changeDirectoryPath, openFolderById, createFile, jumpBreadcrumb} = useFileExplorerStore()

    const cdPath = ()=>{
        changeDirectoryPath(windowId,"/")
    }

    useEffect(()=>{
        initFileDatabase()
        .then(()=>{
            changeDirectoryPath(windowId,"/")
            setFileStatus(true)
        })
    },[])

    const updatePath = (
        fileNode: fileNode
    )=>{
        if(fileNode.type === "file") return
        openFolderById(windowId,
            {
                id:fileNode.id,
                name:fileNode.givenName,
            }
        )
    }

    const createFileUI = ()=>{
        createFile(nodeName,"file",windowState.currentFolderId, windowId)
        .then(
            ()=>{
                console.log("adidtion success")
            }
        )
        .catch(()=>{
            console.error("Error creating file.")
        })
    }

    const createFolderUI = ()=>{
        createFile(nodeName,"folder",windowState.currentFolderId, windowId)
        .then(
            ()=>{
                console.log("adidtion success")
            }
        )
        .catch(()=>{
            console.error("Error creating file.")
        })
    }

    const navigateBreadcrumb = (
        breadcrumb: breadcrumb
    )=>{
        jumpBreadcrumb(windowId,breadcrumb)
        .then(()=>{
            console.log("success jumping")
        })
        .catch(()=>{
            console.error("Error ui jump")
        })
    }

    return (<div>
        FileExplorer System.
        {fileStats && <><button onClick={cdPath}>
            get the files
        </button>
        Files and folder for  {windowState?.currentFolderId ? windowState.currentFolderId : ""} : 
        {windowFiles.map((file)=>(
            <button key={file.id} onDoubleClick={()=>{updatePath(file)}}>{file.givenName} : {file.type}</button>
        ))}
        <br></br>
        Breadcrumb 
        {
            windowState?.breadcrumbArray ? windowState.breadcrumbArray.map(bread=>(
                <button key={bread.id} onClick={()=>{navigateBreadcrumb(bread)}}>{bread.name}</button>
            )) : ""
        }
        <br/>
        createFile
        <input
            value={nodeName}
            onChange={(e)=>{
                setNodeName(e.target.value)
            }}
        />
        <button
            onClick={createFileUI}
            disabled = {windowFiles.some(fNode=>(fNode.givenName === nodeName && fNode.type==="file"))}
        >
            create File
        </button>

        <button
            onClick={createFolderUI}
            disabled = {windowFiles.some(fNode=>(fNode.givenName === nodeName && fNode.type==="folder"))}
        >
            create Folder
        </button>
        </>
        }
    </div>)
}

export default FileExplorer