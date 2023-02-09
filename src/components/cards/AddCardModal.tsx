import { useState } from "react"
import { AddCardModalProps, Difficulty } from "../../types"
import Modal from "../general/Modal"
import Select from "react-select"

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
    const [source, setSource] = useState("")
    const [difficulty, setDifficulty] = useState(Difficulty.Easy)

    return (
        <Modal widthVw={60} heightVh={70}>
            <span
                className="absolute top-6 right-12 w-[80%] text-right 
                    text-5xl font-thin"
                onClick={() => unrender(false)}
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
                <input
                    type="text"
                    className="mb-4 w-full rounded px-2 py-1 text-black 
                        outline-none"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                <h5>Difficulty:</h5>
                <Select
                    isSearchable={false}
                    placeholder=""
                    className="mb-6 w-full rounded text-black"
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
                    className="rounded-md bg-green-500 p-2"
                    onClick={() =>
                        unrender(true, { title, source, difficulty })
                    }
                >
                    Add +
                </button>
            </div>
        </Modal>
    )
}

export default AddCardModal
