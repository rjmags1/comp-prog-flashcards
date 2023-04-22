import { useState } from "react"
import AddToDeckModal from "./AddToDeckModal"
import { Tooltip } from "react-tooltip"

function AddCardToDeckButton() {
    const [renderModal, setRenderModal] = useState(false)

    return (
        <>
            {renderModal && (
                <AddToDeckModal
                    widthVw={60}
                    heightVh={70}
                    unrender={() => setRenderModal(false)}
                />
            )}
            <Tooltip anchorId="add-deck-button" />
            <button
                id="add-deck-button"
                title="Add card to another deck"
                className="hover:opacity-50"
                onClick={() => setRenderModal(true)}
                data-tooltip-content="Add card to another deck"
            >
                <img src="deck.png" className="max-w-[30px]"></img>
            </button>
        </>
    )
}

export default AddCardToDeckButton
