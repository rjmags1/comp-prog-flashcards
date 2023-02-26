import { useState, useContext } from "react"
import {
    AddCardModalProps,
    AppLevelContext,
    CardFetchMetadata,
    CardMetadata,
    DeckLevelContext,
    Difficulty,
    DifficultyLookup,
} from "../../types"
import Modal from "../general/Modal"
import Select from "react-select"
import { AppContext } from "../../app/App"
import { invoke } from "@tauri-apps/api"
import { DeckContext } from "../../pages/CardsPage"

type DifficultyOption = {
    label: string
    value: string
}

const difficultyOptions: DifficultyOption[] = [
    { label: Difficulty.Easy, value: Difficulty.Easy },
    { label: Difficulty.Medium, value: Difficulty.Medium },
    { label: Difficulty.Hard, value: Difficulty.Hard },
]

type SourceOption = {
    label: string
    value: string
}

function AddCardModal({ unrender }: AddCardModalProps) {
    const [title, setTitle] = useState("")
    const [source, setSource] = useState<SourceOption | null>(null)
    const [difficulty, setDifficulty] = useState<DifficultyOption | null>(null)
    const { sources } = useContext(AppContext) as AppLevelContext
    const { currentDeck, updater, cards, filteredCards } = useContext(
        DeckContext
    ) as DeckLevelContext

    const sourceOptions: SourceOption[] = Array.from(sources.values()).map(
        ({ id, name }) => ({ label: name, value: name })
    )

    const addCard = async () => {
        try {
            const sourceId = !source
                ? null
                : new Map(
                      Array.from(sources.entries()).map(([id, src]) => [
                          src.name,
                          id,
                      ])
                  ).get(source!.value)
            const {
                id,
                front,
                back,
                mastered,
                source: source_,
                shipped,
                difficulty: difficulty_,
                tags,
            }: CardFetchMetadata = await invoke("add_card", {
                title,
                sourceId: sourceId || null,
                sourceName: sourceId ? source : null,
                difficulty: difficulty!.value,
                deckId: currentDeck,
            })

            const newCard: CardMetadata = {
                id,
                front,
                back,
                mastered,
                source: source_,
                shipped,
                difficulty: DifficultyLookup.get(difficulty_)!,
                tags: new Set(tags),
            }

            const newCards = new Map([[id, newCard], ...Array.from(cards)])

            const newFilteredCards = new Map([
                [id, newCard],
                ...filteredCards.entries(),
            ])

            updater!((prevDeckContext) => ({
                ...prevDeckContext,
                currentCardId: id,
                cards: newCards,
                filteredCards: newFilteredCards,
            }))
            unrender()
            setTitle("")
            setSource(null)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Modal widthVw={60} heightVh={70}>
            <span
                className="absolute top-6 right-12 w-[80%] text-right 
                    text-5xl font-thin hover:cursor-pointer hover:opacity-50"
                onClick={() => unrender()}
            >
                ×
            </span>
            <div className="flex w-[70%] flex-col">
                <h3 className="mb-8 text-4xl italic">Add New Card</h3>
                <h5>Title:</h5>
                <input
                    type="text"
                    className="mb-4 w-full rounded px-2 py-1 text-black 
                        outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <h5>Source:</h5>
                <Select
                    className="mb-6 w-full rounded text-black"
                    value={source}
                    onChange={(newOption) => setSource(newOption!)}
                    options={sourceOptions as any}
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
                <h5>Difficulty:</h5>
                <Select
                    isSearchable={false}
                    placeholder=""
                    className="text-black"
                    value={difficulty}
                    onChange={(newOption) => setDifficulty(newOption!)}
                    options={difficultyOptions as any}
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
                    className="mt-6 rounded-md bg-green-500 p-2"
                    onClick={addCard}
                >
                    Add +
                </button>
            </div>
        </Modal>
    )
}

export default AddCardModal
