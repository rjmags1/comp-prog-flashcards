import { CardMetadata } from "./types"

export const nextCardId = (
    currCardId: number,
    cardIds: Map<number, CardMetadata>,
    step: number
) => {
    const arrCardIds = Array.from(cardIds.keys())
    const i = arrCardIds.indexOf(currCardId)
    let j = i === -1 ? 0 : i + step
    if (j === -1 || j === arrCardIds.length) {
        j = j === -1 ? arrCardIds.length - 1 : 0
    }

    return arrCardIds[j]
}
