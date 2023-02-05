import { TabProps } from "../../types"

function Tab({
    addingNew,
    title,
    selectedIndex,
    index,
    deletePopupRenderer,
    clickHandler,
}: TabProps) {
    return (
        <button
            style={{
                backgroundColor: selectedIndex === index ? "#171717" : "",
                color: addingNew ? "#9ca3af" : "",
            }}
            disabled={addingNew}
            onClick={clickHandler}
            className="flex w-full max-w-[18%]
            items-center justify-between overflow-hidden truncate rounded-t-lg 
            bg-gray-500 px-2 py-1 hover:bg-gray-600 disabled:hover:bg-gray-500"
        >
            {title}
            {index > 0 && index === selectedIndex && (
                <span
                    style={{
                        backgroundColor:
                            selectedIndex === index ? "#171717" : "",
                        color: addingNew ? "#9ca3af" : "",
                    }}
                    className="text-white hover:text-gray-500"
                    onClick={deletePopupRenderer}
                >
                    ×
                </span>
            )}
        </button>
    )
}

export default Tab
