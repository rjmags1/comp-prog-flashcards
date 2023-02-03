import { AppContext } from "../../app/App"
import { AppLevelContext, CardTagsProps, Tag, colors } from "../../types"
import { useContext, useState } from "react"
import Tag_ from "./Tag"
import AddTagToCardButton from "./AddTagToCardButton"

const shuffledColors = new Array(...colors).sort(
    () => Math.random() - Math.random()
)

function CardTags({ cardData }: CardTagsProps) {
    const appContext = useContext(AppContext) as AppLevelContext
    const { tags } = appContext
    const [cardTags, setCardTags] = useState<Tag[]>(
        Array.from(cardData.metadata.tags).map((tagId) => tags.get(tagId)!)
    )

    return (
        <div
            id="card-tags"
            className="flex h-fit w-full flex-wrap 
            items-center gap-x-2 px-4 py-2"
        >
            <AddTagToCardButton
                cardTags={cardTags}
                adder={(newTags: Tag[]) =>
                    setCardTags((prev) => [...prev, ...newTags])
                }
            />
            {cardTags.map((td, i) => (
                <Tag_
                    key={td.id}
                    tagData={td}
                    color={shuffledColors[i % colors.length]}
                    remover={() =>
                        setCardTags((prev) =>
                            Array.from(prev).filter((t) => t.id != td.id)
                        )
                    }
                />
            ))}
        </div>
    )
}

export default CardTags
