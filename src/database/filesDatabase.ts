import type { fileNode } from "./files.types";

export class filesDatabase {
    private dbName = "FileSystem_WebInception"
    private dbVersion = 1;
    private db: IDBDatabase | null = null
    private store = "filesStore"
    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion)


            request.onupgradeneeded = () => {
                const db = request.result

                const objectStore = db.createObjectStore(this.store, { keyPath: "id" })

                objectStore.createIndex("parentId", "parentId", { unique: false })
                objectStore.createIndex("restoreParentId", "restoreParentId", { unique: false })
                objectStore.createIndex("by_parent_name", ["parentId", "givenName", "type"], { unique: true })
            }

            request.onsuccess = () => {
                resolve(request.result)
                this.db = request.result;
            }
            request.onerror = () => {
                console.error("Indexed db not allowed!!!",);
                reject("indexdb disabled")
            }
        })
    }

    public async addFile(node: fileNode): Promise<boolean> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            try {

                const transaction = db.transaction(this.store, "readwrite")

                transaction.oncomplete = () => {
                    console.log("Adding to the store success!!!")
                }

                transaction.onerror = () => {
                    console.error("Adding file failed")
                    reject("Failure adding...")
                }

                const objectStore = transaction.objectStore(this.store)
                const request = objectStore.put(node)
                request.onsuccess = () => {
                    console.log("Adding to the file success!!!")
                    resolve(true)
                }
                request.onerror = (e) => {
                    console.error("Error adding file", e)
                    reject(`Error adding file : ${e}`)
                }
            }
            catch (e) {
                console.error("UncaughtError: ", e)
                reject(`Error adding file Exception : ${e}`)
            }
        })
    }

    public async getFiles(): Promise<fileNode[]> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            try {

                const objStore = db.transaction(this.store, "readwrite").objectStore(this.store)

                const request = objStore.openCursor()
                const returnFileNodes: fileNode[] = []

                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) {
                        returnFileNodes.push(cursor.value)
                        cursor.continue();
                    }
                    else {
                        resolve(returnFileNodes)
                    }
                }

            }
            catch (e) {
                console.log("Error in getting all files: ", e)
                reject(`${e}`)
            }
        })
    }

    public async getFilesByParentId(parentId: string): Promise<fileNode[]> {
        const db = await this.init()
        return new Promise((resolve,reject)=>{
            try {

            const objStore = db.transaction(this.store, "readwrite").objectStore(this.store)
            const index = objStore.index('parentId')

            const range = IDBKeyRange.only(parentId)

            const request = index.getAll(range)

            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    resolve(cursor)
                    // returnNodes.push(cursor.value)
                    // cursor.continue()
                }
                else {
                    console.log("No array")
                    // successCallback(returnNodes)
                }
            }
        }
        catch (e) {
            console.log("Error getting all files in ", parentId, " : ", e)
            reject(`${e}`)
        }
        })
    }

    public async getFileNode(parentId:string, name:string):Promise<fileNode>{
        const db = await this.init()

        return new Promise((resolve,reject)=>{
            try{
                const objectStore = db.transaction(this.store, "readonly").objectStore(this.store)
                const index = objectStore.index('by_parent_name')
                const range = IDBKeyRange.only([parentId,name,'file'])

                const request = index.get(range)
                request.onsuccess = ()=>{
                    const node = request.result;
                    if(node){
                        resolve(node)
                    }
                    else{
                        console.error("Error getting node"
                        )
                        reject("Error gettign node.")
                    }
                }
            }
            catch(e){
                console.error("Error getting the file",e)
                reject(`Error gettign node: ${e}`)
            }
        })
    }

    public async getFileById(id:string):Promise<fileNode>{
        const db = await this.init()
        return new Promise((resolve,reject)=>{
            try{
                const objectStore = db.transaction(this.store, "readwrite").objectStore(this.store)
                const getRequest = objectStore.get(id)
                getRequest.onsuccess = ()=>{
                    const node = getRequest.result
                    resolve(node)
                }
                getRequest.onerror = ()=>{
                    reject("Error getting file")
                }
            }
            catch(e){
                console.error("Getting error in getting file",e)
            }
        })
    }

    public async updateFileNode(Id:string, updates:Partial<fileNode>):Promise<boolean>{
        const db = await this.init()
        const exisitingFileNode = await this.getFileById(Id)

        return new Promise((resolve,reject)=>{
            try{
                if(!exisitingFileNode){
                    reject("Not getting the node.")
                }
                const updatedNode = {...exisitingFileNode, ...updates}
                const objectStore = db.transaction(this.store, "readwrite").objectStore(this.store)
                const putRequest = objectStore.put(updatedNode)

                putRequest.onsuccess = ()=>resolve(true)
                putRequest.onerror = ()=>reject("Not able to update the file.")
            }
            catch(e){
                console.error("Error recycleing the file",e)
                reject(`Error rejecting the File : ${e}`)
            }
        })
    }

}