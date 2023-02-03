import MarkdownPreview from "@uiw/react-markdown-preview"
import { PromptProps } from "../../types"

const source = `
## MarkdownPreview

> todo: React component preview markdown text.
`
document.documentElement.setAttribute("data-color-mode", "light")

function Prompt({ cardData }: PromptProps) {
    return <MarkdownPreview source={cardData.prompt} />
}

export default Prompt
