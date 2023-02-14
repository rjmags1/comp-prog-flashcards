import { AppContext } from "../../app/App"
import {
    AppLevelContext,
    CardTagsProps,
    Tag,
    colors,
    DeckLevelContext,
} from "../../types"
import { useContext, useEffect, useState } from "react"
import Tag_ from "./Tag"
import AddTagToCardButton from "./AddTagToCardButton"
import { DeckContext } from "../../pages/CardsPage"

const shuffledColors = new Array(...colors).sort(
    () => Math.random() - Math.random()
)

function CardTags({ cardData }: CardTagsProps) {
    const appContext = useContext(AppContext) as AppLevelContext
    const { cards, currentCardId } = useContext(DeckContext) as DeckLevelContext
    const { tags } = appContext
    const [cardTags, setCardTags] = useState<Tag[]>([])

    useEffect(() => {
        setCardTags(
            Array.from(cardData.metadata.tags).map((tagId) => tags.get(tagId)!)
        )
    }, [cardData])

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
                    cardData={cards.get(currentCardId!)!}
                    color={shuffledColors[i % colors.length]}
                    remover={() =>
                        setCardTags((prev) =>
                            Array.from(prev).filter((t) => t.id !== td.id)
                        )
                    }
                />
            ))}
        </div>
    )
}

export default CardTags
