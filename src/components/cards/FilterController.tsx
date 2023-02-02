import { TagType } from "../../types"
import CardTitleDatalist from "./CardTitleDataList"
import TagFilter from "./TagFilter"

function FilterController() {
    return (
        <div className="flex w-full gap-x-3 px-12 text-black">
            <CardTitleDatalist />
            <TagFilter tagType={TagType.Paradigm} />
            <TagFilter tagType={TagType.Concept} />
            <TagFilter tagType={TagType.Trick} />
        </div>
    )
}

export default FilterController
