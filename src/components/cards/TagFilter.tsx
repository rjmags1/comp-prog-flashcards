import { useContext, useState } from "react"
import { AppLevelContext, DeckLevelContext, TagFilterProps } from "../../types"
import { AppContext } from "../../app/App"
import { DeckContext } from "../../pages/CardsPage"
import Select, { Options } from "react-select"

interface TagFilterOption {
    value: string
    label: string
    id: number
    selected: boolean
}

function TagFilter({ tagType }: TagFilterProps) {
    const { tags } = useContext(AppContext) as AppLevelContext
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { filterTags, updater, cards } = deckContext

    const options: Options<TagFilterOption> = Array.from(tags)
        .filter(([tagId, tag]) => tag.type === tagType)
        .map(([tagId, tag]) => ({
            value: tag.name,
            label: tag.name,
            id: tagId,
            selected: filterTags.has(tagId),
        }))
        .sort((t1, t2) => Number(t2.selected) - Number(t1.selected))

    const selectedIds = options.filter((o) => o.selected).map((o) => o.id)

    return (
        <Select
            className="min-w-[18%]"
            isSearchable={true}
            isClearable={selectedIds.length > 0}
            value={{
                label: `${tagType}s`,
                value: `${tagType}s`,
                id: 0,
                selected: false,
            }}
            onChange={(clicked) => {
                let newFilterTags = new Set(filterTags)
                if (clicked === null) {
                    for (const sid of selectedIds) newFilterTags.delete(sid)
                } else {
                    const clickedId = clicked.id
                    if (clicked!.selected) {
                        newFilterTags.delete(clickedId)
                    } else {
                        newFilterTags.add(clickedId)
                    }
                }
                const newFilterTagsArr = Array.from(newFilterTags)
                const newDisplayedCardsArr = Array.from(cards.entries()).filter(
                    ([_, metadata]) =>
                        newFilterTags.size === 0 ||
                        newFilterTagsArr.every((tagId) =>
                            metadata.tags.has(tagId)
                        )
                )
                updater!({
                    ...deckContext,
                    filterTags: newFilterTags,
                    displayedCards: new Map(newDisplayedCardsArr),
                    currentCardId:
                        newDisplayedCardsArr.length > 0
                            ? newDisplayedCardsArr[0][0]
                            : -1,
                })
            }}
            closeMenuOnSelect={false}
            options={options}
            styles={{
                control: (baseStyles, state) => ({
                    borderRadius: ".375rem",
                    display: "flex",
                    backgroundColor: "white",
                }),
                menu: (baseStyles, state) => ({
                    ...baseStyles,
                    maxHeight: "70vh",
                }),
                input: (baseStyles, state) => ({
                    ...baseStyles,
                    outline: "none",
                }),
                placeholder: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                }),
                dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                }),
                indicatorSeparator: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: "black",
                }),
                option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.data.selected ? "#22c55e" : "",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    "&:hover": {
                        cursor: "pointer",
                        backgroundColor: state.data.selected
                            ? "#22c55e"
                            : "#a7f3d0",
                    },
                }),
                clearIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "red",
                }),
            }}
        />
    )
}

export default TagFilter
