import { useContext, useEffect, useState } from "react"
import { DeckContext, tempCard } from "../../pages/CardsPage"
import { Card, CardMetadata, DeckLevelContext } from "../../types"
import CardHeader from "./CardHeader"

// TODO:
//    - tauri command for fetching card prompt, solution, notes, title

function Card_() {
    const { currentCardId, cards } = useContext(DeckContext) as DeckLevelContext
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
        <div className="mx-4 h-full basis-full rounded-md bg-white">
            <CardHeader cardData={cardData} />
        </div>
    )
}

export default Card_
