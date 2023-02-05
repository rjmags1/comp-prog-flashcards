import { useEffect, useState } from "react"
import { CardFrontProps } from "../../types"
import MarkdownPreview from "@uiw/react-markdown-preview"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { useCardFrontHandleResize, useOutsideClickHandler } from "../../hooks"

document.documentElement.setAttribute("data-color-mode", "light")

function CardFront({ cardData }: CardFrontProps) {
    const [prompt, setPrompt] = useState("")
    const cardFrontSize = useCardFrontHandleResize()
    const {
        ref: outsideRef,
        render: editMode,
        setRender: setEditMode,
    } = useOutsideClickHandler(false)

    useEffect(() => {
        if (cardData.prompt.length > 0) setPrompt(cardData.prompt)
    }, [cardData])

    return editMode ? (
        <div
            ref={outsideRef as any}
            className="no-scrollbar relative mx-2 overflow-y-scroll 
                rounded-md border border-black"
            style={{ height: Number.isNaN(cardFrontSize) ? "" : cardFrontSize }}
        >
            <MarkdownEditor
                value={prompt}
                onChange={setPrompt}
                enableScroll={false}
            />
        </div>
    ) : (
        <div
            onClick={() => setEditMode(true)}
            style={{ height: Number.isNaN(cardFrontSize) ? "" : cardFrontSize }}
            className="no-scrollbar mx-2 overflow-hidden overflow-y-scroll
            rounded-md border border-black py-3 px-2 hover:cursor-pointer"
        >
            <MarkdownPreview source={prompt} />
        </div>
    )
}

export default CardFront
