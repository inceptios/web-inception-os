import { create } from "zustand";
import type { fileNode } from "../database/files.types";
import { filesDatabase } from "../database/filesDatabase";
import type { breadcrumb } from "../systemApps/FileExplorer/FileExplorer.types";
import { FileDb } from "../database/files.instance";

export type WindowFolderState = {
    currentFolderId: string,
    breadcrumbArray: breadcrumb[]
}

export interface FileExplorerStore {
    folderMap: Record<string, fileNode[]>,
    windowFolderMap: Record<string, WindowFolderState>,
    changeDirectoryPath: (windowId: string, path: string) => Promise<void>,
    createFile : (fileName:string, type: "file"| "folder", parentId: string, windowId:string)=> Promise<void>,
    openFolderById: (windowId: string, breadcrumb: breadcrumb) => Promise<void>,
    jumpBreadcrumb : (windowId: string, breadcrumb: breadcrumb) => Promise<void>,
}

export const resolvePath = async (FileDb: filesDatabase, path: string): Promise<breadcrumb[] | null> => {
    try {
        if (path === "/") {
            return [{
                id: "root",
                name: "root",
            }]
        }
        const fileNames = path.split('/').slice(1,)
        console.log("files : ", fileNames)
        let prevNodeParentId = "root"
        const returnBreadcrumbs: breadcrumb[] = []
        for (const fileName of fileNames) {
            const node = await FileDb.getFolderNode(prevNodeParentId, fileName)
            if (!node) {
                console.error("Error resolving path")
                return null
            }
            prevNodeParentId = node.parentId
            returnBreadcrumbs.push({ id: node.id, name: node.givenName })
        }

        return returnBreadcrumbs
    }
    catch (e) {
        console.error("Error resolving path", e)
        return null
    }
}

export const useFileExplorerStore = create<FileExplorerStore>((set, get) => ({
    folderMap: {},
    windowFolderMap: {},
    changeDirectoryPath: async (windowId: string, path: string): Promise<void> => {
        try {
            const breadcrumbs = await resolvePath(FileDb, path)
            if (breadcrumbs) {
                const upperFolder = breadcrumbs.at(-1) ?? { id: 'root', name: '' }
                const filesNodes = await FileDb.getFilesByParentId(upperFolder?.id)
                const state = get()

                const existingFolderMap = state.folderMap
                const exisingWindowMap = state.windowFolderMap

                set({
                    folderMap: {
                        ...existingFolderMap,
                        [upperFolder.id]: filesNodes
                    },
                    windowFolderMap: {
                        ...exisingWindowMap,
                        [windowId]: {
                            currentFolderId: upperFolder.id,
                            breadcrumbArray: breadcrumbs
                        }
                    }
                })
            }
        }
        catch (e) {
            console.error("Getting error while getting path", e)
            Promise.reject("Error opening path.")
        }

    },
    openFolderById: async (windowId: string, breadcrumb: breadcrumb): Promise<void> => {
        try {
            const filesAndFolders = await FileDb.getFilesByParentId(breadcrumb.id)

            if (filesAndFolders) {
                set(state => {
                    const currentWindow = state.windowFolderMap[windowId]
                    return {
                        folderMap: {
                            ...state.folderMap,
                            [breadcrumb.id]: filesAndFolders
                        },
                        windowFolderMap: {
                            ...state.windowFolderMap,
                            [windowId]: {
                                breadcrumbArray: [
                                    ...currentWindow.breadcrumbArray,
                                    breadcrumb
                                ],
                                currentFolderId: breadcrumb.id
                            }
                        }
                    }
                })
            }

        }
        catch (e) {
            console.error("Error opeing folder", e)
            Promise.reject("Error opening folder")
        }
    },
    createFile: async (fileName:string, type: "file"| "folder", parentId: string, windowId:string): Promise<void>=>{
        try{
            const node:fileNode = {
                id: crypto.randomUUID(),
                parentId,
                givenName: fileName,
                type,
                lastModified: Date.now()
            }

            const status = await FileDb.addFile(node)
            
            if(status){
                const refreshFiles = await FileDb.getFilesByParentId(parentId)
                set(state=>{
                    return {
                        folderMap:{
                            ...state.folderMap,
                            [parentId]: refreshFiles
                        },
                    }
                })
            }
        }
        catch(err){
            console.error("Error adding file",err)
            Promise.reject("Error adding file")
        }
    },
    jumpBreadcrumb: async (windowId: string, breadcrumb: breadcrumb): Promise<void> =>{
        try{
            const updatedFilesAndFolders = await FileDb.getFilesByParentId(breadcrumb.id)

            set(state=>{
                const currentWindow = state.windowFolderMap[windowId]
                const breadcrumbIndex = currentWindow.breadcrumbArray.indexOf(breadcrumb)
                const newBreadcrumbs = currentWindow.breadcrumbArray.slice(0,breadcrumbIndex+1)

                return{
                    folderMap:{
                        ...state.folderMap,
                        [breadcrumb.id]: updatedFilesAndFolders
                    },
                    windowFolderMap:{
                        ...state.windowFolderMap,
                        [windowId]: {
                            currentFolderId: breadcrumb.id,
                            breadcrumbArray: newBreadcrumbs
                        }
                    }

                }
            })
        }
        catch(e){
            console.error("Error going to breadcrumb",e)
            Promise.reject("Error going to the breadcrumb")
        }
    }
}))