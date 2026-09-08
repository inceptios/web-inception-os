import type { FC } from "react";
import SystemSetting from "../systemApps/SystemSetting/SystemSetting";

export const systemApps: Record<string, FC>= {
    "system_setting":SystemSetting
}