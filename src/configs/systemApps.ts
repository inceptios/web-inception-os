import type { FC } from "react";
import SystemSetting from "../systemApps/SystemSetting/SystemSetting";
import FileExplorer from "../systemApps/FileExplorer/FileExplorer";

export const systemApps: Record<string, FC>= {
    "system_setting":SystemSetting,
    "file_explorer":FileExplorer
}