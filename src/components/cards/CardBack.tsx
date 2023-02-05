import MarkdownEditor from "@uiw/react-markdown-editor"
import MarkdownPreview from "@uiw/react-markdown-preview"
import { useState, useEffect } from "react"
import { useCardBackHandleResize, useOutsideClickHandler } from "../../hooks"
import { CardBackProps, Tab } from "../../types"
import PopupMessage from "../general/PopupMessage"
import NewTab from "./NewTab"
import Tab_ from "./Tab"

function CardBack({ cardData }: CardBackProps) {
    const [tabs, setTabs] = useState<Tab[]>([])
    const [tabIdx, setTabIdx] = useState(0)
    const [selectedTab, setSelectedTab] = useState<Tab | null>(null)
    const [tabContent, setTabContent] = useState("")
    const [addingNew, setAddingNew] = useState(false)
    const [renderDeletePopup, setRenderDeletePopup] = useState(false)
    const cardBackSize = useCardBackHandleResize()
    const {
        ref: outsideRef,
        render: editMode,
        setRender: setEditMode,
    } = useOutsideClickHandler(false)

    // fill tabs using cardData
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

    // UI tab change --> setTabIdx --> below effect trigger
    //    --> update db and JS tab data --> setSelectedTab, setTabContent
    //    --> update UI to new tab
    useEffect(() => {
        if (tabs.length === 0) return
        if (addingNew) {
            setTabContent("")
            return
        }
        if (selectedTab !== null && selectedTab.content !== tabContent) {
            // write to db
            // ....

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
        if (tabIdx < tabs.length) {
            setSelectedTab(tabs[tabIdx])
            setTabContent(tabs[tabIdx].content)
        }
    }, [tabIdx, tabs])

    useEffect(() => {
        return () => {
            if (selectedTab !== null && selectedTab.content !== tabContent) {
                // write to db on tab unmount if needed
            }
        }
    }, [selectedTab])

    return (
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
                <NewTab
                    addingNew={addingNew}
                    opener={() => {
                        setEditMode(true)
                        setAddingNew(true)
                        setTabIdx(tabs.length)
                    }}
                    saver={(newTitle: string) => {
                        // write to db
                        const newTab: Tab = {
                            title: newTitle,
                            content: tabContent,
                            index: tabIdx,
                        }
                        setTabs((prev) => [...prev, newTab])
                        setSelectedTab(newTab)
                        setAddingNew(false)
                        setEditMode(false)
                    }}
                    discarder={() => {
                        setAddingNew(false)
                        setTabIdx(0)
                        setEditMode(false)
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
                    message={`Are you sure you want to delete ${
                        selectedTab!.title
                    }`}
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
