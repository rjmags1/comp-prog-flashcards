import Modal from "../general/Modal"
import Select from "react-select"
import { useContext, useState } from "react"
import { AppContext } from "../../app/App"
import {
    AddTagsModalProps,
    AppLevelContext,
    DeckLevelContext,
} from "../../types"
import NewTagForm from "./NewTagForm"
import ExitButton from "../general/ExitButton"
import { DeckContext } from "../../pages/CardsPage"
import { invoke } from "@tauri-apps/api"

type TagOption = {
    value: number
    label: string
}

function AddTagsModal({ cardTags, unrender, adder }: AddTagsModalProps) {
    const { tags } = useContext(AppContext) as AppLevelContext
    const { currentCardId } = useContext(DeckContext) as DeckLevelContext
    const [addedTagOptions, setAddedTagOptions] = useState<TagOption[]>([])

    const cardTagIds = new Set(Array.from(cardTags.map((t) => t.id)))
    const options: TagOption[] = Array.from(tags.entries())
        .filter(([id, _]) => !cardTagIds.has(id))
        .map(([id, tag]) => ({
            value: id,
            label: tag.name,
        }))

    const onAdd = async () => {
        try {
            const tagIds = addedTagOptions.map((o) => o.value)
            await invoke("add_tags_to_card", { cardId: currentCardId, tagIds })
            adder(tagIds.map((id) => tags.get(id)!))
            unrender()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Modal widthVw={70} heightVh={80}>
            <div className="-mt-4 mb-4 flex w-full justify-end pr-8">
                <ExitButton exitCallback={unrender} />
            </div>
            <div className="flex w-[80%] flex-col justify-end">
                <h5 className="w-full pb-2 text-left text-2xl italic">
                    Add existing tags to this card:
                </h5>
                <div className="w-full">
                    <Select
                        isMulti
                        name="tags"
                        onChange={(added) => setAddedTagOptions([...added])}
                        value={addedTagOptions}
                        placeholder="Select tags..."
                        options={options as any}
                        className="w-full text-left text-black"
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
                        onClick={onAdd}
                        className="mt-4 flex w-fit items-center justify-center 
                        rounded-md bg-green-500 py-1 px-2 hover:bg-green-800"
                    >
                        Add tags
                    </button>
                </div>
                <h5 className="w-full pb-2 pt-12 text-left text-2xl italic">
                    Create a new tag:
                </h5>
                <NewTagForm />
            </div>
        </Modal>
    )
}

export default AddTagsModal
