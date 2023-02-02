import {
    ScrollButtonProps,
    ScrollDirection,
    DeckLevelContext,
} from "../../types"
import { DeckContext } from "../../pages/CardsPage"
import { useContext } from "react"
import { nextCardId } from "../../helpers"

function ScrollButton({ direction }: ScrollButtonProps) {
    const deckContext = useContext(DeckContext) as DeckLevelContext

    const scroll = () => {
        const { displayedCards, currentCardId, updater } = deckContext
        const step = direction === ScrollDirection.Prev ? -1 : 1
        updater!({
            ...deckContext,
            currentCardId: nextCardId(currentCardId, displayedCards, step),
        })
    }

    return (
        <span
            onClick={scroll}
            className="flex h-full w-fit select-none items-center justify-center
                rounded px-2 text-4xl hover:cursor-pointer hover:bg-blue-900"
        >
            {direction === ScrollDirection.Prev ? "◀" : "▶"}
        </span>
    )
}

export default ScrollButton
