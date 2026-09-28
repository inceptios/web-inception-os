import type { breadcrumb } from "../FileExplorer.types"

type PathAddressBarProps = {
    breadcrumbs: breadcrumb[],
    jumpBreadcrump: (bread: breadcrumb) => void,
}

const PathAddressBar = ({ breadcrumbs, jumpBreadcrump }: PathAddressBarProps) => {
    return (
        <div
            id="path-container"
        >
            {breadcrumbs.map((bread,index) => {
                return (
                    <div key={bread.id}
                        className="bread-btn-container"
                    >
                    {index === jumpBreadcrump.length-1 ? "" : ">"}
                    <button
                    className="bread-btn"
                        
                        onClick={()=>{jumpBreadcrump(bread)}}
                    >
                        {bread.name} 
                    </button>
                    </div>
                )
            })}
        </div>
    )
}

export default PathAddressBar