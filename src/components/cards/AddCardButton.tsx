import { useContext, useState } from "react"
import { DeckContext } from "../../pages/CardsPage"
import { DeckLevelContext, Difficulty } from "../../types"
import AddCardModal from "./AddCardModal"

function AddCardButton() {
    const [renderModal, setRenderModal] = useState(false)
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { updater, cards } = deckContext

    return (
        <>
            <button
                onClick={() => setRenderModal(true)}
                disabled={renderModal}
                className="mb-[6px] text-5xl hover:opacity-50 disabled:text-gray-500"
            >
                +
            </button>
            {renderModal && (
                <AddCardModal
                    unrender={(add, newCardInfo) => {
                        setRenderModal(false)
                        if (add) {
                            // write to db with tauri command using newCardInfo

                            const newCards = new Map(cards)
                            newCards.set(cards.size + 1, {
                                id: cards.size + 1, // from tauri return
                                front: cards.size + 1, // from tauri return
                                back: cards.size + 1, // from tauri return
                                mastered: false,
                                source: 1, // from tauri return
                                shipped: false,
                                difficulty: Difficulty.Easy, // from tauri return
                                tags: new Set(),
                            })
                            updater!({
                                ...deckContext,
                                cards: newCards,
                                currentCardId: cards.size + 1,
                            })
                        }
                    }}
                />
            )}
        </>
    )
}

export default AddCardButton
