import { useState, useEffect, useContext } from "react"
import { FilterLevelContext, TagFilterOptionProps } from "../../types"
import { FilterContext } from "./FilterController"

function TagFilterOption({ id, tag }: TagFilterOptionProps) {
    const filterContext = useContext(FilterContext) as FilterLevelContext
    const { filterTags, updater } = filterContext
    const [selected, setSelected] = useState(filterTags.has(id))

    useEffect(() => {
        const newFilters = new Set(filterTags)
        if (selected) newFilters.add(id)
        else newFilters.delete(id)
        updater!({
            ...filterContext,
            filterTags: newFilters,
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
