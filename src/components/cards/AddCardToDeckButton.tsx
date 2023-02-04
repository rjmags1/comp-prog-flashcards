import { useState } from "react"
import AddToDeckModal from "./AddToDeckModal"

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
            <button
                title="Add card to another deck"
                className="hover:opacity-50"
                onClick={() => setRenderModal(true)}
            >
                <img src="deck.png" className="max-w-[30px]"></img>
            </button>
        </>
    )
}

export default AddCardToDeckButton
