import { LegacyRef, useContext } from "react"
import { AppLevelContext, TagFilterProps } from "../../types"
import { AppContext } from "../../app/App"
import useOutsideClickHandler from "../../hooks"
import TagFilterOption from "./TagFilterOption"

function TagFilter({ tagType }: TagFilterProps) {
    const { tags } = useContext(AppContext) as AppLevelContext
    const { ref, render, setRender } = useOutsideClickHandler(false)

    return (
        <>
            <div
                style={render ? { borderRadius: ".375rem .375rem 0 0" } : {}}
                ref={ref as LegacyRef<HTMLDivElement>}
                className="relative min-w-[18%] shrink rounded-md bg-white px-2"
            >
                <div
                    onClick={() => setRender(true)}
                    className="flex justify-between pt-1"
                >
                    <span>{tagType}s</span>
                    <span className="mt-[1.5px] text-sm">▼</span>
                </div>
                {render && (
                    <div
                        className="no-scrollbar absolute -ml-2 mt-[1px] 
                        max-h-[80vh] w-full overflow-y-scroll 
                        rounded-b-md bg-white"
                    >
                        {Array.from(tags.entries())
                            .filter(([_, tag]) => tag.type === tagType)
                            .map(([id, tag]) => (
                                <TagFilterOption key={id} id={id} tag={tag} />
                            ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default TagFilter
