// TODO:
//    - add deck tauri command logic on click

function AddCardToDeckButton() {
    return (
        <button
            title="Add card to another deck"
            className="hover:opacity-50"
            onClick={() => {}} // invoke tauri command; won't affect current cardsPage UI
        >
            <img src="deck.png" className="max-w-[45px]"></img>
        </button>
    )
}

export default AddCardToDeckButton
