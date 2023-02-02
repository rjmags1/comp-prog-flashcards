import {
    ScrollButtonProps,
    ScrollDirection,
    DeckLevelContext,
} from "../../types"
import { DeckContext } from "../../pages/CardsPage"
import { useContext } from "react"

function ScrollButton({ direction }: ScrollButtonProps) {
    const deckContext = useContext(DeckContext) as DeckLevelContext

    const scroll = () => {
        const { displayedCards, currentCardId, updater } = deckContext
        const displayedCardsIds = Array.from(displayedCards.keys())
        const i = displayedCardsIds.indexOf(currentCardId)
        const step = direction === ScrollDirection.Prev ? -1 : 1
        let j = i === -1 ? 0 : i + step
        if (j === -1 || j === displayedCardsIds.length) {
            j = j === -1 ? displayedCardsIds.length - 1 : 0
        }
        updater!({
            ...deckContext,
            currentCardId: displayedCardsIds[j],
        })
    }

    return (
        <span
            onClick={scroll}
            className="flex h-full w-fit items-center justify-center 
                rounded px-2 text-4xl hover:cursor-pointer hover:bg-blue-900"
        >
            {direction === ScrollDirection.Prev ? "◀" : "▶"}
        </span>
    )
}

export default ScrollButton
