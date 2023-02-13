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
                <AddCardModal unrender={() => setRenderModal(false)} />
            )}
        </>
    )
}

export default AddCardButton
