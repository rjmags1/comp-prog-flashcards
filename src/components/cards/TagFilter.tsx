import { LegacyRef, useContext, useState } from "react"
import { AppLevelContext, DeckLevelContext, TagFilterProps } from "../../types"
import { AppContext } from "../../app/App"
import useOutsideClickHandler from "../../hooks"
import TagFilterOption from "./TagFilterOption"
import { DeckContext } from "../../pages/CardsPage"

function TagFilter({ tagType }: TagFilterProps) {
    const { tags } = useContext(AppContext) as AppLevelContext
    const { filterTags } = useContext(DeckContext) as DeckLevelContext
    const { ref, render, setRender } = useOutsideClickHandler(false)
    const [searchText, setSearchText] = useState("")

    const options = Array.from(tags.entries())
        .filter(
            ([_, tag]) =>
                tag.type === tagType && tag.name.indexOf(searchText) > -1
        )
        .map(([id, tag]) => <TagFilterOption key={id} id={id} tag={tag} />)
    options.sort(
        (tag1, tag2) =>
            Number(filterTags.has(tag2.props.id)) -
            Number(filterTags.has(tag1.props.id))
    )

    return (
        <>
            <div
                style={render ? { borderRadius: ".375rem .375rem 0 0" } : {}}
                ref={ref as LegacyRef<HTMLDivElement>}
                className="relative min-w-[20%] shrink rounded-md bg-white px-2"
            >
                {!render && (
                    <div
                        onClick={() => setRender(true)}
                        className="flex select-none justify-between pt-1 
                            hover:cursor-pointer"
                    >
                        <span>{tagType}s</span>
                        <span className="mt-[1.5px] text-sm">▼</span>
                    </div>
                )}
                {render && (
                    <input
                        placeholder="Search"
                        value={searchText}
                        autoFocus
                        className="flex w-full justify-between rounded-md pt-1 text-black outline-none"
                        onChange={(e) => setSearchText(e.target.value)}
                    ></input>
                )}
                {render && (
                    <div
                        className="no-scrollbar absolute -ml-2 mt-[1px] max-h-[80vh] 
                        w-full overflow-y-scroll rounded-b-md bg-white drop-shadow-xl"
                    >
                        {options}
                    </div>
                )}
            </div>
        </>
    )
}

export default TagFilter
