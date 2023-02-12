import { invoke } from "@tauri-apps/api"
import { useState, useContext } from "react"
import { AppContext } from "../../app/App"
import { DecksContext } from "../../pages/DecksPage"
import { AppLevelContext, Deck, DecksLevelContext } from "../../types"
import PopupMessage from "../general/PopupMessage"

function BlankDeck() {
    const [newName, setNewName] = useState("")
    const [addDeckError, setAddDeckError] = useState("")
    const decksContext = useContext(DecksContext) as DecksLevelContext
    const { users, currentUser } = useContext(AppContext) as AppLevelContext

    const addDeck = async () => {
        try {
            const newDeck: Deck = await invoke("add_deck", {
                name: newName,
                user: users.get(currentUser!)!.id,
            })
            const { decks, updater } = decksContext
            const newDecks = new Map(decks)
            newDecks.set(newDeck.id, newDeck)
            updater!({
                ...decksContext,
                addingNew: false,
                decks: newDecks,
            })
            setAddDeckError("")
        } catch (e) {
            console.log(e)
            setAddDeckError(e as string)
        }
    }

    const unrender = (clickedSave: boolean) => {
        if (clickedSave) {
            addDeck()
            return
        }

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
            {addDeckError && (
                <PopupMessage
                    whiteText
                    confirm
                    message={`Deck add failed: ${addDeckError}. Consider using a different name`}
                    unrender={() => setAddDeckError("")}
                />
            )}
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
                    onClick={() => unrender(true)}
                >
                    ✓
                </button>
                <button
                    onClick={() => unrender(false)}
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
