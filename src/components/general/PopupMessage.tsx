import { PopupMessageProps } from "../../types"

function PopupMessage({
    message,
    confirm,
    unrender,
    whiteText,
}: PopupMessageProps) {
    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10">
            <div
                style={whiteText ? { color: "white" } : {}}
                className="fixed top-[50%] left-[50%] z-20 -ml-[200px] 
            -mt-[100px] flex h-[200px] w-[400px] flex-col 
            items-center justify-center rounded-md border border-white
            bg-stone-800 px-6 text-base drop-shadow-xl"
            >
                {message}
                {confirm ? (
                    <button
                        className="mt-6 w-[100px] rounded-md border 
                  border-white bg-green-500 py-1 px-2 hover:bg-green-800"
                        onClick={(e) => {
                            e.stopPropagation()
                            unrender()
                        }}
                    >
                        OK
                    </button>
                ) : (
                    <div className="flex w-full items-center justify-center gap-x-5">
                        <button
                            className="mt-6 w-[100px] rounded-md border 
                    border-white bg-red-600 py-1 px-2 hover:bg-red-800"
                            onClick={(e) => {
                                e.stopPropagation()
                                unrender(true)
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="mt-6 w-[100px] rounded-md border 
                    border-white bg-gray-600 py-1 px-2 hover:bg-gray-800"
                            onClick={(e) => {
                                e.stopPropagation()
                                unrender(false)
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PopupMessage
