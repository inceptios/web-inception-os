import { useEffect, useState, type FC } from "react"
import { useFileExplorerStore } from "../../stores/fileExplorerStore"
import type { SystemAppsPros } from "@configs/systemApps"
import { initFileDatabase } from "../../database/files.instance"
import type { fileNode } from "../../database/files.types"
import type { breadcrumb } from "./FileExplorer.types"
import { FolderIcon } from "./assects/FolderIcon"
import { FileIcon } from "./assects/FileIcon"
import './FileExplorer.css'
import PathAddressBar from "./components/PathAddressBar"

const FileExplorer: FC<SystemAppsPros> = ({windowId}) => {
    const [fileStats,setFileStatus] = useState<boolean>(false)
    const [nodeName,setNodeName] = useState<string>("new File")
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
        createFile(nodeName,"file",windowState.currentFolderId)
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
        createFile(nodeName,"folder",windowState.currentFolderId)
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

    if(!fileStats){
        return(<p>Loading app...</p>)
    }

    return (<div
        id="file-explorer-container"
    >
        {/* <ContextMenu
            isContextMenuShown = {true}
            menuCoordinates={{x:0,y:0}}
            contextRef={()=>{}}
            functionRef={()=>{}}
            menuItems={[
                {
                    menuId:"newfile",
                    title:"New File",
                    enabled: windowFiles.some(fNode=>(fNode.givenName === nodeName && fNode.type==="file"))
                },
                {
                    menuId: "newfolder",
                    title: "New folder",
                    enabled: windowFiles.some(fNode=>(fNode.givenName === nodeName && fNode.type==="folder"))
                }
            ]
            }
        /> */}

        <PathAddressBar 
            breadcrumbs={windowState?.breadcrumbArray ?? []}
            jumpBreadcrump={navigateBreadcrumb}
        />
        <div
            id="file-explorer-grid"
        >
        {windowFiles.map(file=>{
            return (
                <button
                    key={file.id}
                    className="node-btn"
                    onDoubleClick={()=>{
                        if(file.type === "folder"){updatePath(file)}
                    }}
                >
                    {file.type == "file" ? <FileIcon width={48} height={48}/> : <FolderIcon width={48} height={48}/>}
                    <p>{file.givenName}</p>
                </button>
            )
        })}
        </div>
        <div
            style={{
                marginBottom:'0.4rem'
            }}
        >

        <input
            value={nodeName}
            onChange={(e)=>{
                setNodeName(e.target.value)
            }}
        />
        <button
            onClick={createFileUI}
            disabled={windowFiles.some(node=>node.givenName===nodeName && node.type==="file")}
        >
            Create File
        </button>
        <button
            onClick={createFolderUI}
            disabled={windowFiles.some(node=>node.givenName===nodeName && node.type==="folder")}
        >
            Create Folder
        </button>
        </div>
    </div>)
}

export default FileExplorer