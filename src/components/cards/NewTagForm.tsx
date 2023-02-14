import { TagType, AppLevelContext, Tag } from "../../types"
import { AppContext } from "../../app/App"
import { useContext, useState } from "react"
import { invoke } from "@tauri-apps/api"
import PopupMessage from "../general/PopupMessage"

function NewTagForm() {
    const appContext = useContext(AppContext) as AppLevelContext
    const [type, setType] = useState(TagType.Paradigm)
    const [name, setName] = useState("")
    const [content, setContent] = useState("")
    const [addFailError, setAddFailError] = useState("")

    const addNewTag = async () => {
        try {
            if (!name) throw new Error("must specify a tag name")
            const newTag: Tag = await invoke("add_tag", {
                tagType: type,
                name,
                content: content || null,
            })

            const { updater, tags } = appContext
            const newTags = new Map(tags)
            newTags.set(newTag.id, newTag)
            updater!({
                ...appContext,
                tags: newTags,
            })
            setName("")
            setContent("")
            setAddFailError("")
        } catch (e) {
            setAddFailError(
                `Tag add failed: ${e}. Consider using a different name.`
            )
        }
    }

    return (
        <div className="flex w-full flex-col items-start justify-center gap-y-2">
            {addFailError && (
                <PopupMessage
                    confirm
                    whiteText
                    unrender={() => setAddFailError("")}
                    message={addFailError}
                />
            )}
            Type:
            <select
                value={type}
                onChange={(e) => setType(e.target.value as TagType)}
                className="rounded-md bg-white py-1 px-2 text-black"
            >
                <option value={TagType.Paradigm}>{TagType.Paradigm}</option>
                <option value={TagType.Concept}>{TagType.Concept}</option>
                <option value={TagType.Trick}>{TagType.Trick}</option>
            </select>
            Name:
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name..."
                className="w-[60%] rounded-md py-1 px-2 text-black outline-none"
            />
            Content (extra info displayed in tag tooltips):
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter tag content"
                className="w-full rounded-md py-1 px-2 text-black outline-none"
            />
            <button
                onClick={addNewTag}
                className="mt-2 flex w-fit items-center justify-center 
                rounded-md bg-green-500 px-2 py-1 hover:bg-green-800"
            >
                Create
            </button>
        </div>
    )
}

export default NewTagForm
