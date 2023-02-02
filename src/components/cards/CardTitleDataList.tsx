import { DeckContext } from "../../pages/CardsPage"
import { LegacyRef, useContext, useEffect, useState } from "react"
import { DeckLevelContext } from "../../types"
import useOutsideClickHandler from "../../hooks"

// TODO:
//    - tauri command to get titles of all cards in the current deck
//        - to fill allTitles state

const tempTitles = [
    "tempTitle1",
    "tempTitle2",
    "tempTitle3",
    "tempTitle4",
    "tempTitle5",
    "tempTitle6",
    "tempTitle7",
    "tempTitle8",
]
const tempTitlesMap: Map<number, string> = new Map()
tempTitles.forEach((t, i) => {
    tempTitlesMap.set(i + 1, t)
})

function CardTitleDatalist() {
    const [allTitles, setAllTitles] = useState<Map<number, string>>(new Map())
    const [searchText, setSearchText] = useState("")
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { currentDeck, displayedCards, cards, updater } = deckContext
    const { ref, render, setRender } = useOutsideClickHandler(false)

    useEffect(() => {
        if (allTitles.size > 0) return

        // tauri command logic here

        setAllTitles(tempTitlesMap)
    })

    return (
        <div
            className="grow-1 relative shrink basis-full"
            ref={ref as LegacyRef<HTMLDivElement>}
            onClick={() => setRender(true)}
        >
            <input
                style={
                    render && displayedCards.size > 0
                        ? { borderRadius: ".375rem .375rem 0 0" }
                        : {}
                }
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-md py-1 px-2 outline-none"
                placeholder="List, search filtered questions by title"
            />
            {render && (
                <div
                    className="no-scrollbar absolute -mt-1 max-h-[80vh] w-full 
                        overflow-y-scroll rounded-b-md bg-white"
                >
                    {Array.from(allTitles.entries())
                        .filter(
                            ([cardId, title]) =>
                                title.indexOf(searchText) > -1 &&
                                displayedCards.has(cardId)
                        )
                        .map(([cardId, title]) => (
                            <option
                                key={cardId}
                                className="no-wrap overflow-hidden text-ellipsis rounded-b-md
                                    px-2 py-1 hover:bg-slate-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updater!({
                                        ...deckContext,
                                        currentCardId: cardId,
                                    })
                                    setRender(false)
                                }}
                            >
                                {title}
                            </option>
                        ))}
                </div>
            )}
        </div>
    )
}

export default CardTitleDatalist
