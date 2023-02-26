import { AppLevelContext, CardHeaderProps } from "../../types"
import AddCardToDeckButton from "./AddCardToDeckButton"
import DeleteCardFromDeckButton from "./DeleteCardFromDeckButton"
import ToggleMasteryButton from "./ToggleMasteryButton"
import { Tooltip } from "react-tooltip"
import { AppContext } from "../../app/App"
import { useContext } from "react"

function CardHeader({ cardData, flipper }: CardHeaderProps) {
    const { currentUser, users } = useContext(AppContext) as AppLevelContext

    const { hideDiffs } = users.get(currentUser!)!
    return (
        <div
            id="card-header"
            className="flex h-[8%] w-full items-center justify-start 
            gap-x-3 px-6 pt-4 text-black"
        >
            <span className="no-wrap mr-2 w-max text-xl font-extrabold">
                {`${cardData.title}${
                    hideDiffs ? "" : " - " + cardData.metadata.difficulty
                }`}
            </span>
            <Tooltip anchorId="flip-button" />
            <button
                onClick={flipper}
                data-tooltip-content="Click or type spacebar to flip"
                id="flip-button"
                className="h-fit rounded-md border border-black 
                bg-slate-800 px-2 pb-1 text-xl leading-6 text-white 
                hover:bg-slate-700"
            >
                ⟳
            </button>
            <AddCardToDeckButton />
            <DeleteCardFromDeckButton />
            <ToggleMasteryButton />
        </div>
    )
}

export default CardHeader
