import { useCallback, useEffect, useState } from "react"
import { CardFrontProps } from "../../types"
import MarkdownPreview from "@uiw/react-markdown-preview"
import MarkdownEditor from "@uiw/react-markdown-editor"
import useOutsideClickHandler from "../../hooks"

document.documentElement.setAttribute("data-color-mode", "light")

function CardFront({ cardData }: CardFrontProps) {
    const [ticker, setTicker] = useState(0)
    const [prompt, setPrompt] = useState("")
    const {
        ref: outsideRef,
        render: editMode,
        setRender: setEditMode,
    } = useOutsideClickHandler(false)

    useEffect(() => {
        if (cardData.prompt.length > 0) setPrompt(cardData.prompt)
    }, [cardData])

    const cardHeight = document.getElementById("card")?.getBoundingClientRect()
        .height!
    const tagsHeight = document
        .getElementById("card-tags")
        ?.getBoundingClientRect().height!
    const headerHeight = document
        .getElementById("card-header")
        ?.getBoundingClientRect().height!
    const size = cardHeight - tagsHeight - headerHeight - 7.5

    const tick = useCallback(() => setTicker((t) => t + 1), [])

    useEffect(() => {
        window.addEventListener("resize", tick)
        return () => window.removeEventListener("resize", tick)
    }, [])

    return editMode ? (
        <div
            ref={outsideRef as any}
            className="no-scrollbar relative mx-2 overflow-y-scroll 
                rounded-md border border-black"
            style={{ height: Number.isNaN(size) ? "" : size }}
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
            style={{ height: Number.isNaN(size) ? "" : size }}
            className="no-scrollbar mx-2 overflow-hidden overflow-y-scroll
            rounded-md border border-black py-3 px-2 hover:cursor-pointer"
        >
            <MarkdownPreview source={prompt} />
        </div>
    )
}

export default CardFront
