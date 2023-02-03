import { useCallback, useEffect, useState } from "react"
import { CardFrontProps } from "../../types"
import Prompt from "./Prompt"

function CardFront({ cardData }: CardFrontProps) {
    const [ticker, setTicker] = useState(0)

    const dd = document.getElementById("card")?.getBoundingClientRect().height!
    const asdf = document.getElementById("card-tags")?.getBoundingClientRect()
        .height!
    const qwer = document.getElementById("card-header")?.getBoundingClientRect()
        .height!
    const size = dd - asdf - qwer - 7.5

    const tick = useCallback(() => setTicker((t) => t + 1), [])

    useEffect(() => {
        window.addEventListener("resize", tick)
        return () => window.removeEventListener("resize", tick)
    }, [])

    return (
        <div
            style={{ height: Number.isNaN(size) ? "" : size }}
            className="no-scrollbar mx-2 overflow-hidden 
            overflow-y-scroll rounded-md border border-black py-3 px-2"
        >
            <Prompt cardData={cardData} />
        </div>
    )
}

export default CardFront
