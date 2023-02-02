import { useContext } from "react"
import { DeckContext } from "../../pages/CardsPage"
import { DeckLevelContext } from "../../types"

function AddCardButton() {
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { updater, addingNew } = deckContext
    const blankRenderer = () => {
        updater!({
            ...deckContext,
            addingNew: true,
        })
    }

    return (
        <button
            onClick={blankRenderer}
            disabled={addingNew}
            className="mb-[6px] text-5xl hover:opacity-50 disabled:text-gray-500"
        >
            +
        </button>
    )
}

export default AddCardButton
