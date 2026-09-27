import { filesDatabase } from "./filesDatabase";

export const FileDb = new filesDatabase()

export const initFileDatabase = async ()=>{
    await FileDb.init()
}