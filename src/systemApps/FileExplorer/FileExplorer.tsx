import { useEffect, type FC } from "react"
import { filesDatabase } from "../../database/filesDatabase"

const FileExplorer: FC = () => {
    const FileDb = new filesDatabase()
    useEffect(() => {
        FileDb.init()
            .then(() => {
                console.log("Data base inited.")
            })

        FileDb.getFiles()
            .then((files) => {
                console.log("Getting all the files", files)
            },)
            .catch((error) => {
                console.error("Getting error", error)
            })
    }, [])

    const addFilemvp = () => {
        console.log("Adding folder")
        FileDb.addFile({
            id: crypto.randomUUID(),
            parentId: "root",
            givenName: "Mvp file",
            type: "file",
            lastModified: Date.now()
        })
            .then(ret => {
                console.log("Adding file status on UI", ret)
            })
            .catch((e) => {
                console.error("Adding file error", e)
            })
    }

    const addFoldermvp = () => {
        console.log("Adding folder")
        FileDb.addFile({
            id: crypto.randomUUID(),
            parentId: "root",
            givenName: "Mvp file",
            type: "folder",
            lastModified: Date.now()
        })
            .then(ret => {
                console.log("Adding file status on UI", ret)
            })
            .catch((e) => {
                console.error("Adding file error", e)
            })
    }

    const getFiles = () => {
        console.log("Geting files")
        FileDb.getFilesByParentId(
            "root")
            .then(
                (nodes) => {
                    console.log("got Files", nodes)
                })
            .catch(
                (err) => { console.error("Error on ui for getting filesId", err) }
            )

    }

    const getFileRoot= ()=>{
        console.log("Getting file")
        FileDb.getFileNode(
            "root",
            "Mvp2 file",
        )
        .then((node)=>{
            console.log("getting the file on ui", node)
        })
        .catch(e=>{
            console.error("Error in UI",e)
        })
    }

    const getFileNode = ()=>{
        console.log("Getting fil by id")
        FileDb.getFileById(
            "9ceb3140-0626-4021-8f83-0316d37d7d66"
        )
        .then((fileNode)=>{
            console.log("Getting file Node",fileNode)
        })
        .catch((error)=>{
            console.error("Error getting file",error)
        })
    }

    const recycleFileNode = ()=>{
        console.log("Shadow deletion started")
        FileDb.updateFileNode(
            "9ceb3140-0626-4021-8f83-0316d37d7d66",
            {
                parentId:"recycle"
            }
        )
        .then((status)=>{
            console.log("success",status)
        })
        .catch((err)=>{
            console.error("Error updating file",err)
        })
    }
    return (<div>
        FileExplorer System.
        <button
            onClick={addFilemvp}
        >
            Add file this one.
        </button>

        <button
            onClick={addFoldermvp}
        >
            Add Folder this one.
        </button>

        <button
            onClick={getFiles}
        >
            get filesss
        </button>
        <button
            onClick={getFileRoot}
        >
            get file node
        </button>

        <div>
            <button onClick={getFileNode}>
                getFileId
            </button>
            <button onClick={recycleFileNode}>
                recycle file
            </button>
        </div>
    </div>)
}

export default FileExplorer