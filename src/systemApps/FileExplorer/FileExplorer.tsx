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
import { DialogBox } from "web-inception-sdk/ui"
import Input from "./components/Input"
import { useMenu } from "@components/WindowManager/hooks/useMenu"
import UploadDrag from "./components/UploadDrag"
import { useContextMenuStore } from "../../stores/contextMenuStore"
import type { menuItem } from "@configs/osAppStore"

const FileExplorer: FC<SystemAppsPros> = ({ windowId }) => {
    const [fileStats, setFileStatus] = useState<boolean>(false)
    const [nodeName, setNodeName] = useState<string>("new File")
    const [addingNode, setAddingNode] = useState<"file" | "folder" | null>(null)
    const [uploadDrag, setUploadDrag] = useState<boolean>(false)
    const [tooltipNodeId, setTooltipNodeId] = useState<string | null>(null)


    const gridRef = useRef<HTMLDivElement | null>(null)
    const functionRef = useRef<((id: string) => void) | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const tooltipTimer = useRef<number | null>(null)
    const seletedContextNode = useRef<fileNode | null>(null)

    const windowState = useFileExplorerStore((state) => state.windowFolderMap[windowId])
    const windowFiles = useFileExplorerStore(
        (state) => windowState?.currentFolderId ? state.folderMap[windowState.currentFolderId] : undefined
    ) || [];
    const { changeDirectoryPath, openFolderById, createFile, jumpBreadcrumb, createDataFile, deleteNode } = useFileExplorerStore()

    const {isContextMenuShown,setIsContextMenuShown,setMenuCoordinates,setContextMenuActions,setContextMenuItems} = useContextMenuStore()
    // const cdPath = ()=>{
    //     changeDirectoryPath(windowId,"/")
    // }


    const fileFunctions: Record<string, () => void> = {
        newfile: () => {
            setAddingNode("file")
            console.log(
                "new file"
            )
            setIsContextMenuShown(false)
        },
        newfolder: () => {
            setAddingNode("folder")
            console.log("new folder")

            setIsContextMenuShown(false)
        },
        addFile: () => {
            if (fileInputRef) {
                console.log("Ref is there")
                fileInputRef.current?.click()
            }
            setIsContextMenuShown(false)
        },
        deleteNode: () => {
            if (seletedContextNode.current) {
                console.log("Deleteing node", seletedContextNode.current)
                DeleteNodeUI(seletedContextNode.current.id, seletedContextNode.current.parentId)
            }
            setIsContextMenuShown(false)
        }
    }

    const DeleteNodeUI = (fileNodeId: string, parentId: string) => {
        console.log("inside the function456")
        deleteNode(fileNodeId, parentId)
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

    const menuItems: menuItem[] = [
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
            ],

        },
        {
            menuId: 'addFile',
            title: "Add File",
            enabled: true,
        }

    ]

    const nodemenuItems: menuItem[] = [
        {
            menuId: 'deleteNode',
            title: "Delete",
            enabled: true,
        },
        {
            menuId: 'renameNode',
            title: "Rename",
            enabled: true
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
    // const createFileWithDataUI = () => {
    //     const data = new Blob(["This is the test part for the test file in the browser with testing things"], { type: "text/plain" })
    //     createDataFile(nodeName, "file", windowState.currentFolderId, data)
    //         .then(
    //             () => {
    //                 console.log("adidtion success")
    //                 setAddingNode(null)
    //             }
    //         )
    //         .catch(() => {
    //             console.error("Error creating file.")
    //         })
    // }

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

    const downloadFile = async (file: fileNode) => {
        if (!file.data) { return }
        const blobUrl = URL.createObjectURL(file.data)

        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = file.givenName;

        // 2. Click it while it is completely unmounted
        downloadLink.click();
        downloadLink.remove();

        // 3. Destroy the memory pointer
        URL.revokeObjectURL(blobUrl);
    }

    const ProcessUpload = (Files: FileList | null) => {
        if (Files === null) return;
        const files = Array.from(Files)

        console.log("Files array is ", files)

        files.forEach((file) => {

            if (file.type !== "" || (file.type === "" && file.size !== 0)) {
                createDataFile(file.name, "file", windowState.currentFolderId, file)
                    .then(() => {
                        console.log("Upload suceess", file.name)
                    })
                    .catch(() => {
                        console.error("file upload failed")
                    })
            }
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

            onDragEnter={(e) => {
                e.preventDefault()
                console.log("Drag entry")
                setUploadDrag(true)
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    console.log("Drag really left")
                    setUploadDrag(false)
                }
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onDrop={(e) => {
                e.preventDefault()
                setUploadDrag(false)
                ProcessUpload(e.dataTransfer.files)
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (gridRef.current) {
                    setIsContextMenuShown(!isContextMenuShown)
                    setMenuCoordinates({
                        x: e.pageX,
                        y: e.pageY,
                    })
                    setContextMenuItems(menuItems)
                    setContextMenuActions(fileFunctions)
                }
            }}
            onClick={() => {
                setIsContextMenuShown(false)
            }}
        >
            {uploadDrag && <UploadDrag />
            }
            {windowFiles.sort((a, b) => (
                a.givenName.localeCompare(b.givenName)
            )).map(file => {
                return (
                    <>
                        <button
                            key={file.id}
                            className="node-btn"
                            onDoubleClick={() => {
                                if (file.type === "folder") { updatePath(file) }
                                else {
                                    downloadFile(file)
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                e.stopPropagation()

                                if (gridRef.current) {
                                    seletedContextNode.current = file
                                    setIsContextMenuShown(!isContextMenuShown)
                                    setMenuCoordinates({
                                        x: e.clientX,
                                        y: e.clientY,
                                    })
                                    setContextMenuItems(nodemenuItems)
                                    setContextMenuActions(fileFunctions)
                                }
                            }}
                            onMouseEnter={() => {
                                tooltipTimer.current = setTimeout(() => {
                                    console.log("Mouse Enter")
                                    setTooltipNodeId(file.id)
                                }, 500)
                            }}
                            onMouseLeave={() => {
                                console.log("Mouse leave")
                                if (tooltipTimer.current) {
                                    clearTimeout(tooltipTimer.current)
                                    setTooltipNodeId(null)
                                }
                            }}
                            style={{
                                anchorName: `--anchor-btn-${file.id}`
                            }}
                        >
                            {file.type == "file" ? <FileIcon width={48} height={48} /> :
                                <FolderIcon width={48} height={48} />}
                            <p>{file.givenName}</p>
                        </button>
                        {tooltipNodeId === file.id &&
                            <div className="tooltip"
                                style={{
                                    positionAnchor: `--anchor-btn-${file.id}`
                                }}
                            >
                                <p>
                                    {file.givenName}
                                </p>
                            </div>}
                    </>
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
                onClick={createFileWithDataUI}
                disabled={windowFiles.some(node => node.givenName === nodeName && node.type === "file")}
            >
                Create File
            </button> */}
            <input
                type="file"
                ref={fileInputRef}
                style={{
                    display: 'none'
                }}
                onChange={(e) => {
                    ProcessUpload(e.target.files)
                }}
            />
        </div>
    </div >)
}

export default FileExplorer