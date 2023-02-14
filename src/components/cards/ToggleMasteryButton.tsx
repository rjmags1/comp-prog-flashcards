import { useContext } from "react"
import { DeckContext } from "../../pages/CardsPage"
import { invoke } from "@tauri-apps/api"
import { DeckLevelContext } from "../../types"

function ToggleMasteryButton() {
    const deckContext = useContext(DeckContext) as DeckLevelContext

    const { cards, currentCardId } = deckContext
    const cardData = cards.get(currentCardId!)!
    const toggler = async () => {
        const { filteredCards, updater } = deckContext
        const { id, mastered } = cardData
        try {
            const newStatus: boolean = await invoke("update_card_mastery", {
                cardId: id,
                status: !mastered,
            })
            const newCard = { ...cardData, mastered: newStatus }
            const newCards = new Map(cards)
            const newFilteredCards = new Map(filteredCards)
            newCards.set(id, newCard)
            if (newFilteredCards.has(id)) {
                newFilteredCards.set(id, { ...newCard })
            }
            updater!({
                ...deckContext,
                filteredCards: newFilteredCards,
                cards: newCards,
            })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <button
            onClick={toggler}
            title={`${cardData.mastered ? "Unmark" : "Mark"} as mastered`}
            className="flex h-full items-center justify-center"
        >
            <div
                className="h-[25px] w-[25px] rounded border-2 border-black 
                text-green-600 hover:border-gray-400"
            >
                {cardData.mastered && (
                    <span className="text-xl font-extrabold leading-3">✓</span>
                )}
            </div>
        </button>
    )
}

export default ToggleMasteryButton
