import { useContext } from "react"
import { DecksContext } from "../../pages/DecksPage"
import { DecksLevelContext } from "../../types"

function AddDeckButton() {
    const decksContext = useContext(DecksContext) as DecksLevelContext
    const { updater, addingNew } = decksContext
    const blankRenderer = () => {
        updater!({
            ...decksContext,
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

export default AddDeckButton
