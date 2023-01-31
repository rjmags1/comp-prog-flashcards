import { useState, useContext } from "react"
import { DecksContext } from "../../pages/DecksPage"
import { DecksLevelContext } from "../../types"

// TODO:
//    - save new deck button run tauri command,
//          write to DecksContext, render at bottom of screen

function BlankDeck() {
    const [newName, setNewName] = useState("")
    const decksContext = useContext(DecksContext) as DecksLevelContext

    const unrender = () => {
        decksContext.updater!({
            ...decksContext,
            addingNew: false,
        })
    }

    return (
        <div
            className="flex h-60 w-72 flex-col items-center justify-center 
            gap-y-2 rounded-md bg-white pt-2 text-sm text-black"
        >
            <div className="flex items-center justify-center">
                <input
                    className="w-full text-center text-3xl text-black 
                    outline-none placeholder:font-light 
                    placeholder:italic placeholder:text-gray-400"
                    value={newName}
                    autoFocus
                    placeholder="New Deck Name"
                    onChange={(e) => setNewName(e.target.value)}
                ></input>
            </div>
            <div
                className="relative flex items-center justify-center 
                gap-x-3"
            >
                <button
                    className="text-3xl font-bold text-green-600 
                    hover:text-green-800"
                >
                    ✓
                </button>
                <button
                    onClick={unrender}
                    className="text-3xl font-bold text-red-600 
                    hover:text-red-800"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

export default BlankDeck
