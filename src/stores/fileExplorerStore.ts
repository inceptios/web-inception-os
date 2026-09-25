import type { fileNode } from "../database/files.types";
import { filesDatabase } from "../database/filesDatabase";
import type { breadcrumb } from "../systemApps/FileExplorer/FileExplorer.types";

export type WindowFolderState = {
    currentFolderId: string,
    breadcrumbArray: breadcrumb[]
}

export interface FileExplorerStore {
    folderMap: Record<string, fileNode[]>,
    windowFolderMap: Record<string, WindowFolderState>,
    changeDirectoryPath: (windowId: string, path: string) => void,
}

export const resolvePath = async (FileDb: filesDatabase, path: string): Promise<breadcrumb[] | null> => {
    try {
        const fileNames = path.split('/').slice(1,)
        console.log("files",fileNames)
        let prevNodeParentId = "root"
        const returnBreadcrumbs: breadcrumb[] = []
        for (const fileName of fileNames){
            const node = await FileDb.getFolderNode(prevNodeParentId, fileName)
            if(!node){
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