import MarkdownEditor from "@uiw/react-markdown-editor"
import MarkdownPreview from "@uiw/react-markdown-preview"
import { useState, useEffect, useCallback } from "react"
import useOutsideClickHandler from "../../hooks"
import { CardBackProps, Tab } from "../../types"
import PopupMessage from "../general/PopupMessage"

function CardBack({ cardData }: CardBackProps) {
    const [ticker, setTicker] = useState(0)
    const [tabs, setTabs] = useState<Tab[]>([])
    const [tabIdx, setTabIdx] = useState(0)
    const [selectedTab, setSelectedTab] = useState<Tab | null>(null)
    const [tabContent, setTabContent] = useState("")
    const [addingNew, setAddingNew] = useState(false)
    const [newTabTitle, setNewTabTitle] = useState("")
    const [renderPopup, setRenderPopup] = useState(false)
    const {
        ref: outsideRef,
        render: editMode,
        setRender: setEditMode,
    } = useOutsideClickHandler(false)

    // UI tab change --> diff tabIdx --> below effect trigger
    //    --> update db and JS tab data --> update UI to new tab
    useEffect(() => {
        if (addingNew) {
            setTabContent("")
            return
        }
        if (tabs.length !== 0) {
            if (selectedTab !== null && selectedTab.content !== tabContent) {
                // write to db
                setTabs((prev) => [
                    ...prev.slice(0, selectedTab.index),
                    {
                        title: selectedTab.title,
                        content: tabContent,
                        index: selectedTab.index,
                    },
                    ...prev.slice(selectedTab.index + 1),
                ])
            }
            setSelectedTab(tabs[tabIdx])
            setTabContent(tabs[tabIdx].content)
        }
        return () => {
            if (selectedTab !== null && selectedTab.content !== tabContent) {
                // write to db
            }
        }
    }, [tabIdx, tabs])

    useEffect(() => {
        if (cardData.notes.length > 0) {
            setTabs([
                {
                    title: "Notes",
                    content: cardData.notes,
                    index: 0,
                },
                ...cardData.solutions.map(({ name, content }, i) => ({
                    title: name,
                    content,
                    index: i + 1,
                })),
            ])
        }
    }, [cardData])

    const tick = useCallback(() => setTicker((t) => t + 1), [])

    useEffect(() => {
        window.addEventListener("resize", tick)
        return () => window.removeEventListener("resize", tick)
    }, [])

    const cardHeight = document.getElementById("card")?.getBoundingClientRect()
        .height!
    const tagsHeight = document
        .getElementById("card-tags")
        ?.getBoundingClientRect().height!
    const headerHeight = document
        .getElementById("card-header")
        ?.getBoundingClientRect().height!
    const tabsHeight = document.getElementById("tabs")?.getBoundingClientRect()
        .height!
    const size = cardHeight - tagsHeight - headerHeight - tabsHeight - 7.5

    return (
        <div
            className="w-full overflow-hidden"
            ref={addingNew ? null : (outsideRef as any)}
        >
            {renderPopup && (
                <PopupMessage
                    message={`Are you sure you want to delete ${
                        selectedTab!.title
                    }`}
                    whiteText
                    unrender={(d?: boolean) => {
                        setRenderPopup(false)
                        if (d) {
                            setTabs((prev) => [
                                ...prev.slice(0, tabIdx),
                                ...prev.slice(tabIdx + 1),
                            ])
                        }
                    }}
                />
            )}
            <div
                id="tabs"
                className="flex max-h-[2.2rem] w-full gap-x-[2px] px-3"
            >
                {tabs.map((t, i) => (
                    <button
                        style={{
                            backgroundColor: tabIdx === i ? "#171717" : "",
                            color: addingNew ? "#9ca3af" : "",
                        }}
                        disabled={addingNew}
                        onClick={() => setTabIdx(i)}
                        key={`${i}-tab`}
                        id={`${i}-tab`}
                        className="flex w-full max-w-[18%]
                        items-center justify-between overflow-hidden truncate rounded-t-lg 
                        bg-gray-500 px-2 py-1 hover:bg-gray-600 disabled:hover:bg-gray-500"
                    >
                        {t.title}
                        {i > 0 && i === tabIdx && (
                            <span
                                style={{
                                    backgroundColor:
                                        tabIdx === i ? "#171717" : "",
                                    color: addingNew ? "#9ca3af" : "",
                                }}
                                className="text-white hover:text-gray-500"
                                onClick={() => setRenderPopup(true)}
                            >
                                ×
                            </span>
                        )}
                    </button>
                ))}
                {!addingNew && (
                    <button
                        onClick={() => {
                            setEditMode(true)
                            setAddingNew(true)
                            setTabIdx(tabs.length)
                        }}
                        className="w-max rounded-t-lg bg-gray-500 px-4 
                    text-2xl hover:bg-gray-800"
                    >
                        +
                    </button>
                )}
                {addingNew && (
                    <div className="flex min-w-[25%] max-w-[30%] rounded-t-lg bg-neutral-900 px-2 py-1">
                        <input
                            value={newTabTitle}
                            onChange={(e) => setNewTabTitle(e.target.value)}
                            placeholder={`New Solution ${tabs.length}`}
                            className="h-full w-full overflow-hidden
                            truncate rounded-t-lg bg-neutral-900 outline-none"
                        />
                        <div className="mr-1 flex items-center gap-x-2">
                            <button
                                className="text-xl text-green-500"
                                onClick={() => {
                                    // write to db
                                    const newTab: Tab = {
                                        title: newTabTitle,
                                        content: tabContent,
                                        index: tabIdx,
                                    }
                                    setTabs((prev) => [...prev, newTab])
                                    setSelectedTab(newTab)
                                    setAddingNew(false)
                                    setNewTabTitle("")
                                }}
                            >
                                ✓
                            </button>
                            <button
                                className="text-2xl text-rose-600"
                                onClick={() => {
                                    setAddingNew(false)
                                    setTabIdx(0)
                                    setNewTabTitle("")
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {editMode ? (
                <div
                    className="no-scrollbar relative mx-2 overflow-y-scroll 
                    rounded-md border border-black"
                    style={{ height: Number.isNaN(size) ? "" : size }}
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
                    style={{ height: Number.isNaN(size) ? "" : size }}
                    className="no-scrollbar mx-2 overflow-hidden overflow-y-scroll
                    rounded-md border border-black py-3 px-2 hover:cursor-pointer"
                >
                    <MarkdownPreview
                        source={tabs.length > 0 ? tabContent : ""}
                    />
                </div>
            )}
        </div>
    )
}

export default CardBack
