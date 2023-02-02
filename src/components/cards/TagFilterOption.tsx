import { useState, useEffect, useContext } from "react"
import { TagFilterOptionProps, DeckLevelContext } from "../../types"
import { DeckContext } from "../../pages/CardsPage"

function TagFilterOption({ id, tag }: TagFilterOptionProps) {
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { filterTags, updater, cards } = deckContext
    const [selected, setSelected] = useState(filterTags.has(id))

    useEffect(() => {
        const newFilters = new Set(filterTags)
        if (selected) newFilters.add(id)
        else newFilters.delete(id)

        const arrFilterTags = Array.from(newFilters)
        const newDisplayed = Array.from(cards.entries()).filter(([_, card]) =>
            arrFilterTags.every((t) => card.tags.has(t))
        )
        updater!({
            ...deckContext,
            filterTags: newFilters,
            currentCardId: newDisplayed[0][0],
            displayedCards: new Map(
                newFilters.size === 0 ? cards : newDisplayed
            ),
        })
    }, [selected])

    return (
        <option
            style={selected ? { backgroundColor: "#86efac" } : {}}
            onClick={() => setSelected((prev) => !prev)}
            value={tag.name}
            className="no-wrap w-full overflow-hidden text-ellipsis
            rounded-b-md px-2 py-2 hover:bg-slate-100"
        >
            {tag.name}
        </option>
    )
}

export default TagFilterOption
