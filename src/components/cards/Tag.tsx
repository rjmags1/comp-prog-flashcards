import { invoke } from "@tauri-apps/api"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { TagProps } from "../../types"
import PopupMessage from "../general/PopupMessage"

function Tag({ tagData, color, remover, cardData }: TagProps) {
    const anchorId = `tag-${tagData.id}`
    const [renderPopup, setRenderPopup] = useState(false)

    const doDelete = async () => {
        const { id: tagId } = tagData
        try {
            await invoke("delete_tag_from_card", { cardId: cardData.id, tagId })
            remover()
            setRenderPopup(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div
            id={anchorId}
            style={{ backgroundColor: color }}
            className="flex h-[1.6rem] max-w-[20%] items-center justify-between
            gap-x-2 rounded-full border-2 border-gray-300 px-2 
            text-sm text-white hover:cursor-default"
        >
            {renderPopup && (
                <PopupMessage
                    message={`Remove '${tagData.name}' tag from this card?`}
                    whiteText
                    unrender={(d?: boolean) => {
                        if (d) doDelete()
                    }}
                />
            )}
            {tagData.content && !renderPopup && (
                <Tooltip
                    place="bottom"
                    content={tagData.content}
                    anchorId={anchorId}
                />
            )}
            <span className="h-full truncate align-middle">{tagData.name}</span>
            <button
                onClick={() => setRenderPopup(true)}
                className="pb-[2px] text-base hover:opacity-50"
            >
                ×
            </button>
        </div>
    )
}

export default Tag
