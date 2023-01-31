import { useState } from "react"
import { NewUserFormProps } from "../../types"
import ExitButton from "../general/ExitButton"
import PopupMessage from "../general/PopupMessage"

// TODO:
// - tauri command to add new users to sqlite and update ui accordingly
//      - tauri fs, path APIs to handle avatar
// - logic for handling duplicate username, other problems with user add

function NewUserForm({ unrender }: NewUserFormProps) {
    const [username, setUsername] = useState("")
    const [avatarPath, setAvatarPath] = useState("")
    const [prefillDeck, setPrefillDeck] = useState(true)
    const [renderPopup, setRenderPopup] = useState(false)

    const addFailReason = "username already taken"
    const message = `User add failed due to ${addFailReason}, try again`

    return (
        <div className="bg-stone-800 rounded-lg absolute
            border border-white w-fit h-fit z-10 p-10 flex 
            flex-col gap-y-5 drop-shadow-2xl">
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-4xl font-bold">New User</h2>
                <ExitButton exitCallback={unrender}/>
            </div>
            <div className="flex gap-x-2">
                Username: 
                <input className="rounded-sm text-black px-1 outline-none"
                    type="text" onChange={e => setUsername(e.target.value) } />
            </div>
            <div className="flex gap-x-2">
                Avatar:
                <input type="file" />
            </div>
            <div className="flex gap-x-3">
                Prefill a deck with Leetcode questions?
                <input type="checkbox" checked={prefillDeck}
                    onChange={e => setPrefillDeck(e.target.checked)} />
            </div>
            <button className="w-full bg-green-500 py-1 my-2 rounded 
                border border-white hover:bg-green-800 hover:cursor-pointer
                disabled:hover:bg-green-500 disabled:hover:cursor-default"
                disabled={renderPopup}>
                Add
            </button>
            {
            renderPopup && 
            <PopupMessage confirm message={message} 
                unrender={() => setRenderPopup(false) } />
            }
        </div>
    )
}

export default NewUserForm
