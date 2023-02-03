import { useState } from "react"
import { AddTagToCardButtonProps } from "../../types"
import AddTagsModal from "./AddTagsModal"

function AddTagToCardButton({ cardTags, adder }: AddTagToCardButtonProps) {
    const [renderModal, setRenderModal] = useState(true)

    return (
        <>
            {renderModal && (
                <AddTagsModal
                    cardTags={cardTags}
                    unrender={() => setRenderModal(false)}
                    adder={adder}
                />
            )}
            <button
                onClick={() => setRenderModal(true)}
                className="flex h-[88%] w-max items-center justify-center
                gap-x-2 rounded-full bg-black px-2 pr-3 text-sm 
                text-white hover:bg-slate-600"
            >
                <span className="mb-[1px] font-extrabold">+</span>
                <span className="italic">Add Tags</span>
            </button>
        </>
    )
}

export default AddTagToCardButton
