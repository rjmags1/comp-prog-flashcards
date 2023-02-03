import Modal from "../general/Modal"
import Select, { Options } from "react-select"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../app/App"
import {
    AddToDeckModalProps,
    AppLevelContext,
    DeckLevelContext,
} from "../../types"
import { tempDecks } from "../../pages/DecksPage"
import { DeckContext } from "../../pages/CardsPage"
import ExitButton from "../general/ExitButton"

// TODO:
//    - get all users deck ids, names using user id in app context
//          and whether or not card is in various decks (Tauri command)
//    - add or remove decks via Tauri command based on user's selection

type Option = {
    value: number
    label: string
}

const tempDeckIds: Options<Option> = tempDecks.map((d) => ({
    value: d.id,
    label: d.name,
}))

function AddToDeckModal({ widthVw, heightVh, unrender }: AddToDeckModalProps) {
    const { currentUser } = useContext(AppContext) as AppLevelContext
    const { currentDeck } = useContext(DeckContext) as DeckLevelContext
    const [decks, setDecks] = useState<Options<Option>>([])
    const [selectedDecks, setSelectedDecks] = useState<Options<Option>>([])

    useEffect(() => {
        if (decks.length > 0) return

        // tauri command invocation to get all deck ids

        setDecks(tempDeckIds.filter((d) => d.value !== currentDeck))
    })

    const handleAdd = () => {
        // TODO
    }

    return (
        <Modal widthVw={widthVw} heightVh={heightVh}>
            <div
                className="relative flex h-full w-full flex-col 
                items-center justify-center gap-y-6 text-white"
            >
                <div className="absolute bottom-[75%] flex w-[80%] justify-end">
                    <ExitButton exitCallback={unrender} />
                </div>
                <h5 className="w-[80%] text-left text-xl italic">
                    Add this card to other decks
                </h5>
                <Select
                    defaultValue={[
                        decks.filter((o) => o.value === currentDeck)[0],
                    ]}
                    isMulti
                    name="decks"
                    onChange={(selected) => setSelectedDecks(selected)}
                    value={selectedDecks}
                    placeholder="Select decks..."
                    options={decks as any}
                    className="w-[80%] text-black"
                    isClearable={false}
                    closeMenuOnSelect={false}
                    styles={{
                        control: (baseStyles, state) => ({
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: ".375rem",
                        }),
                        input: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                        }),
                    }}
                />
                <button
                    className="w-[80%] rounded bg-green-500 px-2 py-1 
                    text-white hover:bg-green-800"
                    onClick={handleAdd}
                >
                    + Save
                </button>
            </div>
        </Modal>
    )
}

export default AddToDeckModal
