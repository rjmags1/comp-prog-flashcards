import { ToggleMasteryButtonProps } from "../../types"
import { useState } from "react"

function ToggleMasteryButton({
    status: initialStatus,
}: ToggleMasteryButtonProps) {
    const [status, setStatus] = useState(initialStatus)

    return (
        <button
            onClick={() => setStatus((prev) => !prev)}
            title={`${status ? "Unmark" : "Mark"} as mastered`}
            className="flex h-full items-center justify-center"
        >
            <div
                className="h-[25px] w-[25px] rounded border-2 border-black 
                text-green-600 hover:border-gray-400"
            >
                {status && (
                    <span className="text-xl font-extrabold leading-3">✓</span>
                )}
            </div>
        </button>
    )
}

export default ToggleMasteryButton
