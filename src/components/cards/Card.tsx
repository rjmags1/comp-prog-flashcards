import { invoke } from "@tauri-apps/api"
import { useContext, useEffect, useState } from "react"
import { DeckContext } from "../../pages/CardsPage"
import { Card, CardContent, DeckLevelContext } from "../../types"
import CardBack from "./CardBack"
import CardFront from "./CardFront"
import CardHeader from "./CardHeader"
import CardTags from "./CardTags"

// TODO:
//    - tauri command for fetching card prompt, solution, notes, title

function Card_() {
    const { currentCardId, cards } = useContext(DeckContext) as DeckLevelContext
    const [showFront, setShowFront] = useState(true)
    const [cardData, setCardData] = useState<Card | null>(null)

    const cardLoader = async () => {
        try {
            const metadata = cards.get(currentCardId!)!
            const { front: cardFrontId, back: cardBackId } = metadata
            const { title, prompt, notes, solutions }: CardContent =
                await invoke("load_card", {
                    cardId: currentCardId,
                    cardFrontId,
                    cardBackId,
                })
            setCardData({
                metadata,
                title,
                prompt,
                notes,
                solutions,
            })
        } catch (e) {
            console.log(e)
        }
    }

    console.log(cardData)

    useEffect(() => {
        cardLoader()
    }, [currentCardId])

    return (
        <div
            id="card"
            className="flex h-full w-[80%] basis-full flex-col rounded-md bg-white"
        >
            {!cardData ? null : (
                <>
                    <CardHeader
                        cardData={cardData}
                        flipper={() => setShowFront((prev) => !prev)}
                    />
                    <CardTags cardData={cardData} />
                    {showFront ? (
                        <CardFront cardData={cardData} />
                    ) : (
                        <CardBack cardData={cardData} />
                    )}
                </>
            )}
        </div>
    )
}

export default Card_
