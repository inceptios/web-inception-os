import { useEffect, useRef, useState, type FC } from "react"
import { useFileExplorerStore } from "../../stores/fileExplorerStore"
import type { SystemAppsPros } from "@configs/systemApps"
import { initFileDatabase } from "../../database/files.instance"
import type { fileNode } from "../../database/files.types"
import type { breadcrumb } from "./FileExplorer.types"
import { FolderIcon } from "./assects/FolderIcon"
import { FileIcon } from "./assects/FileIcon"
import './FileExplorer.css'
import PathAddressBar from "./components/PathAddressBar"
import { Button, ContextMenu, DialogBox } from "web-inception-sdk/ui"
import Input from "./components/Input"
import { useMenu } from "@components/WindowManager/hooks/useMenu"

const FileExplorer: FC<SystemAppsPros> = ({ windowId }) => {
    const [fileStats, setFileStatus] = useState<boolean>(false)
    const [nodeName, setNodeName] = useState<string>("new File")
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [contextCordinates, setContextCordinates] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [addingNode, setAddingNode] = useState<"file" | "folder" | null>(null)

    const gridRef = useRef<HTMLDivElement | null>(null)
    const contextRef = useRef<HTMLDivElement | null>(null)
    const functionRef = useRef<((id: string) => void) | null>(null)

    const windowState = useFileExplorerStore((state) => state.windowFolderMap[windowId])
    const windowFiles = useFileExplorerStore(
        (state) => windowState?.currentFolderId ? state.folderMap[windowState.currentFolderId] : undefined
    ) || [];
    const { changeDirectoryPath, openFolderById, createFile, jumpBreadcrumb } = useFileExplorerStore()

    // const cdPath = ()=>{
    //     changeDirectoryPath(windowId,"/")
    // }


    const fileFunctions: Record<string, () => void> = {
        newfile: () => {
            setAddingNode("file")
            console.log(
                "new file"
            )
            setShowContextMenu(false)
        },
        newfolder: () => {
            setAddingNode("folder")
            console.log("new folder")

            setShowContextMenu(false)
        }
    }

    useEffect(() => {
        initFileDatabase()
            .then(() => {
                changeDirectoryPath(windowId, "/")
                setFileStatus(true)
            })
        functionRef.current = ((id) => {
            console.log("Getting tthe id:", id)
            fileFunctions[id]?.()
        })
    }, [])

    useMenu({
        menuActionMap: fileFunctions
    })

    const menuItems = [
        {
            menuId: 'new',
            title: "New",
            enabled: true,
            items: [
                {
                    menuId: "newfile",
                    title: "New File",
                    enabled: windowFiles.some(fNode => (fNode.givenName === nodeName && fNode.type === "file"))
                },
                {
                    menuId: "newfolder",
                    title: "New folder",
                    enabled: windowFiles.some(fNode => (fNode.givenName === nodeName && fNode.type === "folder"))
                }
            ]
        }

    ]

    const updatePath = (
        fileNode: fileNode
    ) => {
        if (fileNode.type === "file") return
        openFolderById(windowId,
            {
                id: fileNode.id,
                name: fileNode.givenName,
            }
        )
    }

    const createFileUI = () => {
        createFile(nodeName, "file", windowState.currentFolderId)
            .then(
                () => {
                    console.log("adidtion success")
                    setAddingNode(null)
                }
            )
            .catch(() => {
                console.error("Error creating file.")
            })
    }

    const createFolderUI = () => {
        createFile(nodeName, "folder", windowState.currentFolderId)
            .then(
                () => {
                    console.log("adidtion success")
                    setAddingNode(null)
                }
            )
            .catch(() => {
                console.error("Error creating file.")
            })
    }

    const navigateBreadcrumb = (
        breadcrumb: breadcrumb
    ) => {
        jumpBreadcrumb(windowId, breadcrumb)
            .then(() => {
                console.log("success jumping")
            })
            .catch(() => {
                console.error("Error ui jump")
            })
    }

    if (!fileStats) {
        return (<p>Loading app...</p>)
    }



    return (<div
        id="file-explorer-container"
        ref={gridRef}
        style={{
            position: 'relative'
        }}
    >
        <ContextMenu
            isContextMenuShown={showContextMenu}
            menuCoordinates={contextCordinates}
            contextRef={contextRef}
            functionRef={functionRef}
            menuItems={menuItems}
        />
        {addingNode && <DialogBox
            dialogTitle={<h3 style={{ margin: 0 }}>Create New {addingNode}</h3>}
            confirmButton={
                <button
                    onClick={() => {
                        if (addingNode === "file") {
                            createFileUI()
                        }
                        else {
                            createFolderUI()
                        }
                    }}
                    disabled={windowFiles.some(node => node.givenName === nodeName && node.type === addingNode)}
                >
                    Create
                </button>
            }
            dismissButton={
                <button
                    onClick={() => {
                        setAddingNode(null)
                    }}
                >
                    Cancel
                </button>
            }
            onDismiss={() => {
                setAddingNode(null)
                console.log("Dismiss")
            }}
        >
            <Input
                autoFocus
                value={nodeName}
                onValueChange={(e) => setNodeName(e)}
                onKeyDown={(e) => e.key === 'Enter' && !windowFiles.some(f => f.givenName === nodeName)}
                style={{ padding: '0.5rem' }}
            />
        </DialogBox>}
        <PathAddressBar
            breadcrumbs={windowState?.breadcrumbArray ?? []}
            jumpBreadcrump={navigateBreadcrumb}
        />

        <div
            id="file-explorer-grid"

            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (gridRef.current) {
                    setShowContextMenu(!showContextMenu)
                    const boundingX = gridRef.current.getBoundingClientRect().x
                    const boundingY = gridRef.current.getBoundingClientRect().y
                    console.log("Cornates", {
                        boundingX, boundingY, clientX: e.clientX, clientY: e.clientY, x: e.clientX - boundingX, y: e.clientY - boundingY
                    })
                    setContextCordinates({
                        x: e.clientX - boundingX,
                        y: e.clientY - boundingY,
                    })
                }
            }}
            onClick={() => {
                setShowContextMenu(false)
            }}
        >
            {windowFiles.map(file => {
                return (
                    <button
                        key={file.id}
                        className="node-btn"
                        onDoubleClick={() => {
                            if (file.type === "folder") { updatePath(file) }
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    >
                        {file.type == "file" ? <FileIcon width={48} height={48} /> :
                            <FolderIcon width={48} height={48} />}
                        <p>{file.givenName}</p>
                    </button>
                )
            })}
        </div>
        <div
            style={{
                marginBottom: '0.4rem'
            }}
        >

            {/* <input
                value={nodeName}
                onChange={(e) => {
                    setNodeName(e.target.value)
                }}
            />
            <button
                onClick={createFileUI}
                disabled={windowFiles.some(node => node.givenName === nodeName && node.type === "file")}
            >
                Create File
            </button>
            <button
                onClick={createFolderUI}
                disabled={windowFiles.some(node => node.givenName === nodeName && node.type === "folder")}
            >
                Create Folder
            </button> */}
        </div>
    </div >)
}

export default FileExplorer