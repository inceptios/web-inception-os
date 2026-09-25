export type breadcrumb = {
    id:string,
    name:string,
}

const displayType = {
    list: "List",
    grid: "Grid",
    detailedList : "DetailedList"
} as const 

export type displayTypes = keyof typeof displayType