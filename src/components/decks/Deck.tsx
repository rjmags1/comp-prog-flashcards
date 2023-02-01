import { useState, useEffect, useContext, useRef } from "react"
import {
    DeckProps,
    Deck,
    DecksLevelContext,
    AppLevelContext,
    Page,
} from "../../types"
import BlankDeck from "./BlankDeck"
import PopupMessage from "../general/PopupMessage"
import { DecksContext } from "../../pages/DecksPage"
import { AppContext } from "../../app/App"

// TODO:
//    - save edited titles to sqlite via Tauri command
//    - delete deck from db on delete button click and popup confirm

function Deck_({ deck, blank }: DeckProps) {
    let name = null,
        mastered = 0,
        size = 0,
        id = -1
    if (deck) {
        ;({ name, mastered, size, id } = deck)
    }
    const deckNameRef = useRef<HTMLInputElement | null>(null)
    const [editing, setEditing] = useState(false)
    const [deckName, setDeckName] = useState(name)
    const [renderDeletePopup, setRenderDeletePopup] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const decksContext = useContext(DecksContext) as DecksLevelContext
    const appContext = useContext(AppContext) as AppLevelContext

    useEffect(() => {
        if (deleted) {
            // tauri command logic placeholder
            const { updater, decks } = decksContext
            const without = new Map(decks)
            without.delete(id)
            updater!({
                ...decksContext,
                decks: without,
            })
        }
    }, [deleted])

    const unrenderPopup = (d?: boolean) => {
        setDeleted(d as boolean)
        setEditing(!(d as boolean))
        setRenderDeletePopup(false)
        if (!(d as boolean) && deckNameRef.current) {
            deckNameRef.current.focus()
        }
    }

    const handleDeckClick = () => {
        if (editing) return
        const { updater, pageHistory } = appContext
        updater!({
            ...appContext,
            pageHistory: [...pageHistory, [Page.Cards, id]],
        })
    }

    const masteredStr = `${mastered} / ${size} mastered`

    if (blank) return <BlankDeck />

    return (
        <div
            onClick={handleDeckClick}
            className="flex h-60 w-72 flex-col items-center justify-start
            gap-y-2 overflow-hidden rounded-md bg-white text-sm text-black 
            hover:cursor-default"
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
                            onClick={(e) => {
                                e.stopPropagation()
                                setEditing(false)
                            }}
                            className="py-4 pr-3 text-3xl 
                            font-bold text-green-600 hover:text-green-800"
                        >
                            ✓
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setRenderDeletePopup(true)
                            }}
                            className="pr-6 text-2xl 
                            font-bold text-red-600 hover:opacity-50"
                        >
                            🗑
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditing(true)
                        }}
                        className="py-4 px-6 text-2xl hover:opacity-50"
                    >
                        ✎
                    </button>
                )}
            </div>
            {editing ? (
                <input
                    ref={deckNameRef}
                    className="-mt-1 w-full pt-4 text-center text-3xl outline-none"
                    autoFocus
                    value={deckName as string}
                    onChange={(e) => {
                        e.stopPropagation()
                        setDeckName(e.target.value)
                    }}
                />
            ) : (
                <h3 className="pt-4 text-3xl hover:cursor-default">
                    {deckName}
                </h3>
            )}
            <span className="hover:cursor-default">{masteredStr}</span>
        </div>
    )
}

export default Deck_
