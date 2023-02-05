import { useContext, useEffect, useState } from "react"
import { DeckContext, tempCard } from "../../pages/CardsPage"
import { Card, CardMetadata, DeckLevelContext } from "../../types"
import CardBack from "./CardBack"
import CardFront from "./CardFront"
import CardHeader from "./CardHeader"
import CardTags from "./CardTags"

// TODO:
//    - tauri command for fetching card prompt, solution, notes, title

function Card_() {
    const { currentCardId, cards } = useContext(DeckContext) as DeckLevelContext
    const [showFront, setShowFront] = useState(true)
    const [cardData, setCardData] = useState<Card>({
        metadata: cards.get(currentCardId) as CardMetadata,
        title: "tempTitle",
        prompt: "",
        solution: "",
        notes: "",
    })

    useEffect(() => {
        // tauri command to get all card data for the currentCardId, then
        const tempNewCard = {
            ...tempCard,
            metadata: {
                ...tempCard.metadata,
                id: currentCardId,
            },
        }
        setCardData(tempNewCard)
    }, [currentCardId])

    return (
        <div
            id="card"
            className="flex h-full w-[80%] basis-full flex-col rounded-md bg-white"
        >
            <CardHeader cardData={cardData} />
            <CardTags cardData={cardData} />
            {showFront ? <CardFront cardData={cardData} /> : <CardBack />}
        </div>
    )
}

export default Card_
