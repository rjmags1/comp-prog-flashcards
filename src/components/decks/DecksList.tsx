import { DecksListProps } from "../../types"
import Deck from "./Deck"

function DecksList({ decks, renderBlank }: DecksListProps) {
    return (
        <div
            className="no-scrollbar flex h-[90%] flex-wrap items-start
            justify-center gap-8 overflow-y-auto px-8 pt-2 pb-8"
        >
            {renderBlank && <Deck blank deck={null} />}
            {decks.map((d) => (
                <Deck deck={d} key={d.id} />
            ))}
        </div>
    )
}

export default DecksList
