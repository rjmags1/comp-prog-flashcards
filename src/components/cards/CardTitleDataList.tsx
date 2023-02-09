import { DeckContext } from "../../pages/CardsPage"
import { useContext, useEffect, useState } from "react"
import { DeckLevelContext } from "../../types"
import Select, { Options } from "react-select"

// TODO:
//    - tauri command to get titles of all cards in the current deck
//        - to fill allTitles state

const tempTitles = [
    "tempTitle1",
    "tempTitle2",
    "tempTitle3",
    "tempTitle4",
    "tempTitle5",
    "tempTitle6",
    "tempTitle7",
    "tempTitle8",
]
const tempTitlesMap: Map<number, string> = new Map()
tempTitles.forEach((t, i) => {
    tempTitlesMap.set(i + 1, t)
})

type CardTitleOption = {
    label: string
    value: string
    id: number
}

function CardTitleDatalist() {
    const [allTitles, setAllTitles] = useState<Map<number, string>>(new Map())
    const [searchText, setSearchText] = useState("")
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { currentDeck, filteredCards, updater, currentCardId } = deckContext

    useEffect(() => {
        if (allTitles.size > 0) return

        // tauri command logic here

        setAllTitles(tempTitlesMap)
    })

    const options: Options<CardTitleOption> =
        allTitles.size === 0
            ? []
            : Array.from(filteredCards.keys())
                  .filter(
                      (id) =>
                          filteredCards.has(id) &&
                          allTitles.get(id)!.indexOf(searchText) > -1
                  )
                  .map((id) => ({
                      label: allTitles.get(id)!,
                      value: allTitles.get(id)!,
                      id: id,
                  }))

    return (
        <Select
            className="w-full"
            options={options}
            closeMenuOnSelect={true}
            value={null}
            placeholder="List, search cards by text..."
            onChange={(option) => {
                updater!({
                    ...deckContext,
                    currentCardId: option!.id,
                })
            }}
            styles={{
                control: (baseStyles, state) => ({
                    borderRadius: ".375rem",
                    display: "flex",
                    backgroundColor: "white",
                }),
                menu: (baseStyles, state) => ({
                    ...baseStyles,
                    maxHeight: "70vh",
                }),
                input: (baseStyles, state) => ({
                    ...baseStyles,
                    outline: "none",
                }),
                placeholder: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                }),
                dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                }),
                indicatorSeparator: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: "black",
                }),
            }}
        />
    )
}

export default CardTitleDatalist
