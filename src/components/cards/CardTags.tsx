import { AppContext } from "../../app/App"
import {
    AppLevelContext,
    CardTagsProps,
    Tag,
    colors,
    DeckLevelContext,
    TagMaskLookup,
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
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const [cardTags, setCardTags] = useState<Tag[]>([])
    const { cards, currentCardId } = deckContext

    useEffect(() => {
        const { tags } = appContext
        setCardTags(
            Array.from(cardData.metadata.tags).map((tagId) => tags.get(tagId)!)
        )
    }, [cardData])

    const { currentUser, users } = appContext
    const { tagMask } = users.get(currentUser!)!

    return (
        <div
            id="card-tags"
            className="flex h-fit w-full flex-wrap 
            items-center gap-x-2 px-4 py-2"
        >
            <AddTagToCardButton
                cardTags={cardTags}
                adder={(newTags: Tag[]) => {
                    const { updater, cards } = deckContext
                    const updatedCards = new Map(cards)
                    const oldCardMetadata = cardData.metadata
                    updatedCards.set(oldCardMetadata.id, {
                        ...oldCardMetadata,
                        tags: new Set([
                            ...oldCardMetadata.tags,
                            ...newTags.map((t) => t.id),
                        ]),
                    })
                    updater!({
                        ...deckContext,
                        cards: updatedCards,
                    })
                    setCardTags((prev) => [...prev, ...newTags])
                }}
            />
            {cardTags
                .filter((td) => (TagMaskLookup.get(td.type)! & tagMask) === 0)
                .map((td, i) => (
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
