import { invoke } from "@tauri-apps/api"
import MarkdownEditor from "@uiw/react-markdown-editor"
import MarkdownPreview from "@uiw/react-markdown-preview"
import { useState, useEffect } from "react"
import { useCardBackHandleResize, useOutsideClickHandler } from "../../hooks"
import { CardBackProps, Solution, Tab } from "../../types"
import PopupMessage from "../general/PopupMessage"
import NewTabButton from "./NewTabButton"
import Tab_ from "./Tab"

function CardBack({ cardData }: CardBackProps) {
    const [tabs, setTabs] = useState<Tab[]>([])
    const [tabIdx, setTabIdx] = useState<null | number>(null)
    const [tabContent, setTabContent] = useState("")
    const [renderDeletePopup, setRenderDeletePopup] = useState(false)
    const [addingNew, setAddingNew] = useState(false)
    const cardBackSize = useCardBackHandleResize(tabIdx)
    const {
        ref: outsideRef,
        render: editMode,
        setRender: setEditMode,
    } = useOutsideClickHandler(false)

    // load tabs into state
    useEffect(() => {
        const { notes, solutions } = cardData
        setTabs([
            { title: "Notes", content: notes, index: 0 },
            ...solutions.map(({ name, content, id }, i) => ({
                solutionId: id,
                title: name,
                content,
                index: i + 1,
            })),
        ])

        setTabIdx(0)
        setTabContent(notes)
        return () => setTabIdx(null)
    }, [cardData])

    // display tabs content
    useEffect(() => {
        if (tabIdx === null) return
        if (addingNew) {
            setTabContent("")
            return
        }

        setTabContent(tabs[tabIdx].content)
    }, [tabIdx, addingNew])

    // edit tab contents
    useEffect(() => {
        if (addingNew || !tabContent || tabIdx === null) return

        const editSaver = async () => {
            const oldTab = tabs[tabIdx]
            if (oldTab.content !== tabContent) {
                const notes = tabIdx === 0
                const editedId = notes
                    ? cardData.metadata.back
                    : tabs[tabIdx].solutionId!
                await invoke("update_notes_or_solution_content", {
                    notes,
                    editedId,
                    content: tabContent,
                })

                const updated: Tab = { ...oldTab, content: tabContent }
                setTabs([
                    ...tabs.slice(0, tabIdx),
                    updated,
                    ...tabs.slice(tabIdx + 1),
                ])
            }
        }

        editSaver()
    }, [tabContent])

    const newTabSaver = async (
        name: string,
        content: string,
        cardBackId: number
    ) => {
        try {
            await invoke("add_solution", { name, content, cardBackId })

            const newTab: Tab = {
                title: name,
                content: tabContent,
                index: tabs.length,
            }
            setTabIdx(tabs.length)
            setTabs((prev) => [...prev, newTab])
            setAddingNew(false)
            setEditMode(false)
        } catch (e) {
            console.error(e)
        }
    }

    return tabIdx === null ? null : (
        <div
            className="w-full overflow-hidden"
            ref={addingNew ? null : (outsideRef as any)}
        >
            <div
                id="tabs"
                className="flex max-h-[2.2rem] w-full gap-x-[2px] px-3"
            >
                {tabs.map((t, i) => (
                    <Tab_
                        key={`${i}-tab`}
                        addingNew={addingNew}
                        title={t.title}
                        selectedIndex={tabIdx}
                        index={i}
                        deletePopupRenderer={() => setRenderDeletePopup(true)}
                        clickHandler={() => setTabIdx(i)}
                    />
                ))}
                <NewTabButton
                    addingNew={addingNew}
                    opener={() => {
                        setAddingNew(true)
                    }}
                    saver={async (newTitle: string) => {
                        newTabSaver(
                            newTitle,
                            tabContent,
                            cardData.metadata.back
                        )
                    }}
                    discarder={() => {
                        setAddingNew(false)
                        setEditMode(false)
                        setTabIdx(0)
                    }}
                />
            </div>
            {editMode ? (
                <div
                    className="no-scrollbar relative mx-2 overflow-y-scroll 
                    rounded-md border border-black"
                    style={{
                        height: Number.isNaN(cardBackSize) ? "" : cardBackSize,
                    }}
                >
                    <MarkdownEditor
                        value={tabContent}
                        onChange={setTabContent}
                        enableScroll={false}
                    />
                </div>
            ) : (
                <div
                    onClick={() => setEditMode(true)}
                    style={{
                        height: Number.isNaN(cardBackSize) ? "" : cardBackSize,
                    }}
                    className="no-scrollbar mx-2 overflow-hidden overflow-y-scroll
                    rounded-md border border-black py-3 px-2 hover:cursor-pointer"
                >
                    <MarkdownPreview
                        source={tabs.length > 0 ? tabContent : ""}
                    />
                </div>
            )}
            {renderDeletePopup && (
                <PopupMessage
                    message={`Are you sure you want to delete ${""}`}
                    whiteText
                    unrender={(d?: boolean) => {
                        setRenderDeletePopup(false)
                        if (d) {
                            setTabs((prev) => [
                                ...prev.slice(0, tabIdx),
                                ...prev.slice(tabIdx + 1),
                            ])
                            setTabIdx(0)
                        }
                    }}
                />
            )}
        </div>
    )
}

export default CardBack
