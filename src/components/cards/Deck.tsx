import { DeckContext } from "../../pages/CardsPage"
import { ScrollDirection, DeckLevelContext } from "../../types"
import Card from "./Card"
import FilterController from "./FilterController"
import ScrollButton from "./ScrollButton"
import { useContext, useEffect } from "react"
import { editingCard, nextCardId } from "../../helpers"

function Deck() {
    const deckContext = useContext(DeckContext) as DeckLevelContext

    const handler = (e: KeyboardEvent) => {
        if (editingCard()) return

        const { filteredCards, currentCardId, updater } = deckContext
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            updater!({
                ...deckContext,
                currentCardId: nextCardId(
                    currentCardId as number,
                    filteredCards,
                    e.key === "ArrowLeft" ? -1 : 1
                ),
            })
        }
    }

    useEffect(() => {
        document.addEventListener("keyup", handler)
        return () => document.removeEventListener("keyup", handler)
    }, [deckContext])

    return (
        <div
            className="flex h-[90%] w-full flex-col items-center 
                justify-center overflow-hidden"
        >
            <FilterController />
            <div
                className="mb-6 flex h-[90%] w-full 
                    items-center justify-center"
            >
                <ScrollButton direction={ScrollDirection.Prev} />
                <Card />
                <ScrollButton direction={ScrollDirection.Next} />
            </div>
        </div>
    )
}

export default Deck
