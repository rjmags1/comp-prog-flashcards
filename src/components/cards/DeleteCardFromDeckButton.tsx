import { DeckContext } from "../../pages/CardsPage"
import { useContext, useState } from "react"
import { DeckLevelContext } from "../../types"
import { nextCardId } from "../../helpers"
import PopupMessage from "../general/PopupMessage"

// TODO:
//    - delete from deck tauri command logic on click

function DeleteCardFromDeckButton() {
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const [renderPopup, setRenderPopup] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const doDelete = () => {
        // invoke tauri command logic

        const { cards, displayedCards, currentCardId, updater } = deckContext
        const newCards = new Map(cards),
            newDisplayedCards = new Map(displayedCards)
        newCards.delete(currentCardId)
        newDisplayedCards.delete(currentCardId)
        updater!({
            ...deckContext,
            currentCardId: nextCardId(currentCardId, displayedCards, 1),
            cards: newCards,
            displayedCards: newDisplayedCards,
        })
    }

    return (
        <>
            {renderPopup && (
                <PopupMessage
                    whiteText
                    message="Remove this card from the deck?"
                    unrender={(d?: boolean) => {
                        setRenderPopup(false)
                        setDeleted(d as boolean)
                    }}
                />
            )}
            <button
                title="Delete card from deck"
                className="text-3xl hover:opacity-50"
                onClick={() => setRenderPopup(true)}
            >
                🗑
            </button>
        </>
    )
}

export default DeleteCardFromDeckButton