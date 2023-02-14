import { DeckContext } from "../../pages/CardsPage"
import { useContext, useState } from "react"
import { DeckLevelContext } from "../../types"
import { nextCardId } from "../../helpers"
import PopupMessage from "../general/PopupMessage"
import { invoke } from "@tauri-apps/api"

// TODO:
//    - delete from deck tauri command logic on click

function DeleteCardFromDeckButton() {
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const [renderPopup, setRenderPopup] = useState(false)

    const doDelete = async () => {
        try {
            const {
                cards,
                filteredCards,
                currentCardId: cardId,
                currentDeck: deckId,
                updater,
            } = deckContext
            const deletedId: number = await invoke("delete_card_from_deck", {
                cardId,
                deckId,
            })

            const newCards = new Map(cards),
                newFilteredCards = new Map(filteredCards)
            newCards.delete(deletedId)
            newFilteredCards.delete(deletedId)
            updater!({
                ...deckContext,
                currentCardId: nextCardId(deletedId, filteredCards, 1),
                cards: newCards,
                filteredCards: newFilteredCards,
            })
            setRenderPopup(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            {renderPopup && (
                <PopupMessage
                    whiteText
                    message="Remove this card from the current deck?"
                    unrender={(d?: boolean) => d && doDelete()}
                />
            )}
            <button
                title="Delete card from deck"
                className="text-lg hover:opacity-50"
                onClick={() => setRenderPopup(true)}
            >
                🗑
            </button>
        </>
    )
}

export default DeleteCardFromDeckButton
