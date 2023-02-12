import { useState, useEffect, useContext, useRef } from "react"
import {
    DeckProps,
    DecksLevelContext,
    AppLevelContext,
    Page,
    Deck,
} from "../../types"
import BlankDeck from "./BlankDeck"
import PopupMessage from "../general/PopupMessage"
import { DecksContext } from "../../pages/DecksPage"
import { AppContext } from "../../app/App"
import { invoke } from "@tauri-apps/api"

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
    const [updateError, setUpdateError] = useState("")
    const [deleted, setDeleted] = useState(false)
    const decksContext = useContext(DecksContext) as DecksLevelContext
    const appContext = useContext(AppContext) as AppLevelContext

    useEffect(() => {
        if (deleted) {
            const deleteDeck = async () => {
                try {
                    const deletedId: number = await invoke("delete_deck", {
                        deckId: id,
                    })
                    const { updater, decks } = decksContext
                    const without = new Map(decks)
                    without.delete(deletedId)
                    updater!({
                        ...decksContext,
                        decks: without,
                    })
                    setEditing(false)
                } catch (e) {
                    console.log(e)
                }
            }

            deleteDeck()
        }
    }, [deleted])

    const updateDeckName = async () => {
        try {
            const updated: Deck = await invoke("update_deck", {
                deckId: id,
                name: deckName,
                size,
                mastered,
            })
            const { updater, decks } = decksContext
            const newDecks = new Map(decks)
            newDecks.set(id, updated)
            updater!({
                ...decksContext,
                decks: newDecks,
            })
            setEditing(false)
        } catch (e) {
            setUpdateError(e as string)
        }
    }

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

    return blank ? (
        <BlankDeck />
    ) : (
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
            {updateError && (
                <PopupMessage
                    whiteText
                    confirm
                    message={`Update failed due to ${updateError}. Consider using a different name`}
                    unrender={() => setUpdateError("")}
                />
            )}
            <div className="w-full text-right">
                {editing ? (
                    <div className="flex items-center justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                updateDeckName()
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
                <h3 className="pt-4 text-3xl hover:cursor-pointer hover:opacity-70">
                    {deckName}
                </h3>
            )}
            <span className="hover:cursor-default">{masteredStr}</span>
        </div>
    )
}

export default Deck_
