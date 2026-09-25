export type fileNode ={
    id: string,
    parentId: string,
    givenName: string,
    restoreParentId?: string,
    type: "file" | "folder",
    lastModified: number,
}