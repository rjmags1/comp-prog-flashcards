import { useState, useEffect } from "react"
import { Tooltip } from "react-tooltip"
import { TagProps } from "../../types"
import PopupMessage from "../general/PopupMessage"

// TODO: remove tag associations via tauri command

function Tag({ tagData, color, remover }: TagProps) {
    const anchorId = `tag-${tagData.id}`
    const [renderPopup, setRenderPopup] = useState(false)
    const [deleted, setDeleted] = useState(false)

    useEffect(() => {
        if (deleted) {
            // remove association via tauri command

            remover()
        }
    }, [deleted])

    return (
        <div
            id={anchorId}
            style={{ backgroundColor: color }}
            className="flex h-[1.6rem] max-w-[20%] items-center justify-between
            gap-x-2 rounded-full border-2 border-gray-300 px-2 text-sm 
            text-white hover:cursor-default"
        >
            {renderPopup && (
                <PopupMessage
                    message={`Remove '${tagData.name}' tag from this card?`}
                    whiteText
                    unrender={(d?: boolean) => {
                        setRenderPopup(false)
                        setDeleted(d as boolean)
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
            <span className="truncate">{tagData.name}</span>
            <button
                onClick={() => setRenderPopup(true)}
                className="text-base hover:opacity-50"
            >
                ×
            </button>
        </div>
    )
}

export default Tag
