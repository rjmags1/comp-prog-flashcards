import Modal from "../general/Modal"
import { useState } from "react"
import AddToDeckModal from "./AddToDeckModal"

function AddCardToDeckButton() {
    const [renderModal, setRenderModal] = useState(true)

    return (
        <>
            {renderModal && (
                <AddToDeckModal
                    widthVw={60}
                    heightVh={40}
                    unrender={() => setRenderModal(false)}
                />
            )}
            <button
                title="Add card to another deck"
                className="hover:opacity-50"
                onClick={() => setRenderModal(true)}
            >
                <img src="deck.png" className="max-w-[45px]"></img>
            </button>
        </>
    )
}

export default AddCardToDeckButton
