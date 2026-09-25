import type { FC } from "react";
import SystemSetting from "../systemApps/SystemSetting/SystemSetting";
import FileExplorer from "../systemApps/FileExplorer/FileExplorer";

export type SystemAppsPros = {
    windowId:string,

}

export const systemApps: Record<string, FC<SystemAppsPros>>= {
    "system_setting":SystemSetting,
    "file_explorer":FileExplorer
}