import { useState, createContext, useEffect, useContext } from "react"
import { FilterLevelContext, TagType, DeckLevelContext } from "../../types"
import CardTitleDatalist from "./CardTitleDataList"
import TagFilter from "./TagFilter"
import { DeckContext } from "../../pages/CardsPage"

export const FilterContext = createContext<FilterLevelContext | null>(null)

function FilterController() {
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const [filterContext, setFilterContext] = useState<FilterLevelContext>({
        filterTags: new Set(),
        updater: null,
    })

    useEffect(() => {
        if (filterContext.updater !== null) return

        setFilterContext({
            ...filterContext,
            updater: setFilterContext,
        })
    })

    useEffect(() => {
        if (!deckContext || !deckContext.updater) return

        const { filterTags } = filterContext
        const arrFilterTags = Array.from(filterTags)
        const { updater, cards } = deckContext
        updater!({
            ...deckContext,
            displayedCards: new Map(
                filterTags.size === 0
                    ? cards
                    : Array.from(cards.entries()).filter(([_, card]) =>
                          arrFilterTags.every((t) => card.tags.has(t))
                      )
            ),
        })
    }, [filterContext])

    return (
        <FilterContext.Provider value={filterContext}>
            <div className="mt-4 flex w-full gap-x-3 text-black">
                <CardTitleDatalist />
                <TagFilter tagType={TagType.Paradigm} />
                <TagFilter tagType={TagType.Concept} />
                <TagFilter tagType={TagType.Trick} />
            </div>
        </FilterContext.Provider>
    )
}

export default FilterController
