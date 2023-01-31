import { PopupMessageProps } from "../../types"

// TODO
// - impl resolution of yes/no questions

function PopupMessage({ message, confirm, unrender }: PopupMessageProps) {
    return (
        <div className="bg-stone-800 z-20 fixed top-[50%] border 
            border-white rounded-md left-[50%] w-[400px] h-[200px] 
            -ml-[200px] -mt-[100px] flex items-center justify-center
            flex-col px-6">
            { message }
            { 
            confirm && 
            <button className="w-[100px] bg-green-500 py-1 px-2 
                rounded-md border border-white mt-6 hover:bg-green-800"
                onClick={() => unrender() }>
                OK
            </button> 
            }
        </div>
    )
}

export default PopupMessage
