import { useState } from "react"
import { NewTabProps } from "../../types"

function NewTabButton({ addingNew, opener, saver, discarder }: NewTabProps) {
    const [newTabTitle, setNewTabTitle] = useState("")

    return addingNew ? (
        <div className="flex min-w-[25%] max-w-[30%] rounded-t-lg bg-neutral-900 px-2 py-1">
            <input
                value={newTabTitle}
                onChange={(e) => setNewTabTitle(e.target.value)}
                placeholder={"New Solution"}
                className="h-full w-full overflow-hidden
                truncate rounded-t-lg bg-neutral-900 outline-none"
            />
            <div className="mr-1 flex items-center gap-x-2">
                <button
                    className="text-xl text-green-500"
                    onClick={() => {
                        saver(newTabTitle)
                        setNewTabTitle("")
                    }}
                >
                    ✓
                </button>
                <button
                    className="text-2xl text-rose-600"
                    onClick={() => {
                        discarder()
                        setNewTabTitle("")
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    ) : (
        <button
            onClick={opener}
            className="w-max rounded-t-lg bg-gray-500 px-4 
        text-2xl hover:bg-gray-800"
        >
            +
        </button>
    )
}

export default NewTabButton
