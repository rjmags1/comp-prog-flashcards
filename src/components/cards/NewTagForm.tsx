import { TagType, AppLevelContext, Tag } from "../../types"
import { AppContext } from "../../app/App"
import { useContext, useState } from "react"

// TODO: tauri command + logic for adding new tag into db

function NewTagForm() {
    const appContext = useContext(AppContext) as AppLevelContext
    const [type, setType] = useState(TagType.Paradigm)
    const [name, setName] = useState("")
    const [content, setContent] = useState("")

    const addNewTag = () => {
        // tauri logic for inserting new tag into db
        // will obsolete nextTagId and instantiating newTag as here

        const { updater, tags } = appContext
        const nextTagId = Math.max(...Array.from(tags.keys())) + 1
        const newTag: Tag = {
            name,
            type,
            content,
            id: nextTagId,
        }

        const newTags = new Map(tags)
        newTags.set(nextTagId, newTag)
        updater!({
            ...appContext,
            tags: newTags,
        })
        setName("")
        setContent("")
    }

    return (
        <div className="flex w-full flex-col items-start justify-center gap-y-2">
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
