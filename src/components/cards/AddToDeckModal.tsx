import Modal from "../general/Modal"
import Select, { Options } from "react-select"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../app/App"
import {
    AddToDeckModalProps,
    AppLevelContext,
    Deck,
    DeckLevelContext,
} from "../../types"
import { DeckContext } from "../../pages/CardsPage"
import ExitButton from "../general/ExitButton"
import { invoke } from "@tauri-apps/api"

type DeckOption = {
    value: number
    label: string
}

function AddToDeckModal({ unrender }: AddToDeckModalProps) {
    const { currentUser, users } = useContext(AppContext) as AppLevelContext
    const { currentDeck, currentCardId } = useContext(
        DeckContext
    ) as DeckLevelContext
    const [decks, setDecks] = useState<Options<DeckOption>>([])
    const [selectedDecks, setSelectedDecks] = useState<Options<DeckOption>>([])

    useEffect(() => {
        if (decks.length > 0) return

        const decksLoader = async () => {
            const { decks }: { decks: Deck[] } = await invoke(
                "load_user_decks",
                {
                    userId: users.get(currentUser!)!.id,
                }
            )
            const alreadyIn = new Set(
                (await invoke("load_card_decks", {
                    cardId: currentCardId,
                })) as number[]
            )
            setDecks(
                decks
                    .filter(({ id }) => !alreadyIn.has(id))
                    .map(({ id, name }) => ({ value: id, label: name }))
            )
        }
        decksLoader()
    })

    const handleAdd = async () => {
        try {
            const deckIds = selectedDecks.map((d) => d.value)
            await invoke("add_card_to_decks", {
                cardId: currentCardId,
                deckIds,
            })
            unrender()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Modal>
            <div
                className="relative flex h-full w-full flex-col 
                items-center justify-start gap-y-5 overflow-hidden text-white"
            >
                <div className="flex w-full justify-end pt-6 pr-6">
                    <ExitButton exitCallback={unrender} />
                </div>
                <h5 className="-mt-4 w-[80%] text-left text-xl italic">
                    Add this card to other decks
                </h5>
                <button
                    className="w-[80%] rounded bg-green-500 px-2 py-1 
                    text-white hover:bg-green-800"
                    onClick={handleAdd}
                >
                    + Save
                </button>
                <Select
                    defaultValue={[
                        decks.filter((o) => o.value === currentDeck)[0],
                    ]}
                    defaultMenuIsOpen={true}
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
            </div>
        </Modal>
    )
}

export default AddToDeckModal
