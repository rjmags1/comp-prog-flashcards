import { PopupMessageProps } from "../../types"

// TODO
// - impl resolution of yes/no questions

function PopupMessage({ message, confirm, unrender }: PopupMessageProps) {
    return (
        <div
            className="fixed top-[50%] left-[50%] z-20 -ml-[200px] 
            -mt-[100px] flex h-[200px] w-[400px] flex-col 
            items-center justify-center rounded-md border border-white
            bg-stone-800 px-6"
        >
            {message}
            {confirm && (
                <button
                    className="mt-6 w-[100px] rounded-md border 
                  border-white bg-green-500 py-1 px-2 hover:bg-green-800"
                    onClick={() => unrender()}
                >
                    OK
                </button>
            )}
        </div>
    )
}

export default PopupMessage
