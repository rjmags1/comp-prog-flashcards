import { CardHeaderProps } from "../../types"
import AddCardToDeckButton from "./AddCardToDeckButton"
import DeleteCardFromDeckButton from "./DeleteCardFromDeckButton"
import ToggleMasteryButton from "./ToggleMasteryButton"

function CardHeader({ cardData }: CardHeaderProps) {
    return (
        <div className="flex h-[8%] w-full items-center justify-start gap-x-3 px-6 pt-4 text-black">
            <span className="no-wrap mr-2 w-max text-xl font-extrabold">
                {cardData.title} - {cardData.metadata.difficulty}
            </span>
            <AddCardToDeckButton />
            <DeleteCardFromDeckButton />
            <ToggleMasteryButton status={false} />
        </div>
    )
}

export default CardHeader
