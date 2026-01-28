export default function UserHome({
    theme,
    category,
    setCategory,
    type,
    setType,
    onCreate,
}){
    return(
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">                
            <div className="flex gap-3 sm">
                {/* Category */}
                <div className="dropdown w-1/2 sm:w-44">
                    <span className="text-[10px] uppercase opacity-60 ml-2">Slip Status</span>
                    <div    
                    tabIndex={0}
                    role="button"
                    className={`border-3 py-1 px-2.5 m-1 text-center ${theme === "dark"
                        ? "hover:bg-white hover:text-black border-white"
                        : "hover:bg-black hover:text-white border-black"
                    }`}
                    >
                    {category}
                    </div>
                    <ul
                    tabIndex="-1"
                    className={`dropdown-content menu border-2 z-1 w-42 p-2 shadow-sm bg-white text-black ${theme === "dark" && "dark:bg-black dark:text-white"}`}
                    >
                    {["All", "Slip-Created", "At Clinic", "Ready for Pickup", "Completed"].map(
                        (item) => (
                        <li key={item}>
                            <button onClick={() => {
                                    setCategory(item);
                                    document.activeElement?.blur();
                                }}
                            >{item}</button>
                        </li>
                        )
                    )}
                    </ul>
                </div>
                {/* Type */}
                <div className="dropdown w-1/2 sm:w-44">
                    <span className="text-[10px] uppercase opacity-60 ml-2">Slip Type</span>
                    <div
                    tabIndex={0}
                    role="button"
                    className={`border-3 py-1 px-2.5 m-1 text-center ${theme === "dark"
                        ? "hover:bg-white hover:text-black border-white"
                        : "hover:bg-black hover:text-white border-black"
                    }`}
                    >
                    {type}
                    </div>
                    <ul
                    tabIndex="-1"
                    className={`dropdown-content menu border-2 z-1 w-42 p-2 shadow-sm bg-white text-black ${theme === "dark" && "dark:bg-black dark:text-white"}`}
                    >
                    {["All","Regular", "Paid"].map((item) => (
                        <li key={item}>
                        <button onClick={() =>{
                                setType(item);
                                document.activeElement?.blur();
                            }}
                        >{item}</button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
            <div className="relative inline-block mt-1 sm:mt-3 group w-full sm:w-auto">
                <div
                    className={`absolute inset-0 translate-x-0.5 translate-y-0.5 border-2 border-black bg-black
                    ${theme === "dark" && "dark:border-white dark:bg-white"}
                    transition-transform duration-150 group-hover:translate-x-0 group-hover:translate-y-0
                    `}
                />
                <button
                    onClick={onCreate}
                    className={`relative border-2 px-2 py-2 w-full sm:w-auto
                        transition-transform duration-150
                        group-hover:translate-x-0.5 group-hover:translate-y-0.5
                        active:translate-x-0 active:translate-y-0
                        ${theme === "dark" ? "dark:bg-black dark:text-white" : "bg-white text-black"}
                    `}
                >
                    +Create Slip
                </button>
            </div>
        </div>
    )
}