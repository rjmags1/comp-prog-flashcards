import { DeckContext } from "../../pages/CardsPage"
import { useContext } from "react"
import { DeckLevelContext } from "../../types"
import { nextCardId } from "../../helpers"

// TODO:
//    - delete from deck tauri command logic on click

function DeleteCardFromDeckButton() {
    const deckContext = useContext(DeckContext) as DeckLevelContext

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
        <button
            title="Delete card from deck"
            className="text-3xl hover:opacity-50"
            onClick={doDelete}
        >
            🗑
        </button>
    )
}

export default DeleteCardFromDeckButton
