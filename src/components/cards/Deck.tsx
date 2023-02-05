import { ScrollDirection } from "../../types"
import Card from "./Card"
import FilterController from "./FilterController"
import ScrollButton from "./ScrollButton"

function Deck() {
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
