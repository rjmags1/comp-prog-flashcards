import { useState, useEffect, useContext } from "react"
import { DeckProps, Deck, DecksLevelContext } from "../../types"
import BlankDeck from "./BlankDeck"
import PopupMessage from "../general/PopupMessage"
import { DecksContext } from "../../pages/DecksPage"

// TODO:
//    - save edited titles to sqlite via Tauri command
//    - delete deck from db on delete button click and popup confirm

function Deck_({ deck, blank }: DeckProps) {
    const { name, mastered, size, id } = deck as Deck
    const [editing, setEditing] = useState(false)
    const [deckName, setDeckName] = useState(name)
    const [renderDeletePopup, setRenderDeletePopup] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const decksContext = useContext(DecksContext) as DecksLevelContext

    useEffect(() => {
        if (deleted) {
            // tauri command logic
            const { updater, decks } = decksContext
            const without = new Map(decks)
            without.delete(id)
            updater!({
                ...decksContext,
                decks: without,
            })
        }
    }, [deleted])

    if (blank) return <BlankDeck />

    const unrenderPopup = (d?: boolean) => {
        setDeleted(d as boolean)
        setRenderDeletePopup(false)
    }

    const masteredStr = `${mastered} / ${size} mastered`
    return (
        <div
            className="flex h-60 w-72 flex-col items-center justify-start
            gap-y-2 overflow-hidden rounded-md bg-white text-sm text-black"
        >
            {renderDeletePopup && (
                <PopupMessage
                    whiteText
                    message={`Are you sure you want to delete ${deckName}?`}
                    unrender={unrenderPopup}
                />
            )}
            <div className="w-full text-right">
                {editing ? (
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => setEditing(false)}
                            className="py-4 pr-3 text-3xl 
                            font-bold text-green-600 hover:text-green-800"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => setRenderDeletePopup(true)}
                            className="pr-6 text-2xl 
                            font-bold text-red-600 hover:opacity-50"
                        >
                            🗑
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="py-4 px-6 text-2xl hover:opacity-50"
                    >
                        ✎
                    </button>
                )}
            </div>
            {editing ? (
                <input
                    className="-mt-1 w-full pt-4 text-center text-3xl outline-none"
                    autoFocus
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                />
            ) : (
                <h3 className="pt-4 text-3xl">{deckName}</h3>
            )}
            {masteredStr}
        </div>
    )
}

export default Deck_
