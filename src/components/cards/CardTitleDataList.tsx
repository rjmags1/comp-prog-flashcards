import { DeckContext } from "../../pages/CardsPage"
import { useContext, useEffect, useState } from "react"
import { DeckLevelContext } from "../../types"
import Select, { createFilter, Options } from "react-select"
import { invoke } from "@tauri-apps/api"
import React from "react"

type CardTitleOption = {
    label: string
    value: string
    id: number
}

const CustomOption = React.memo((props: any) => {
    const { onMouseMove, onMouseOver, ...rest } = props.innerProps
    const newProps = { ...props, innerProps: rest }
    return (
        <div
            {...newProps.innerProps}
            className="p-1 hover:cursor-pointer hover:bg-emerald-200"
        >
            {newProps.data.label}
        </div>
    )
})

function CardTitleDatalist() {
    const [allTitles, setAllTitles] = useState<Map<number, string>>(new Map())
    const [searchText, setSearchText] = useState("")
    const deckContext = useContext(DeckContext) as DeckLevelContext
    const { currentDeck, filteredCards, updater, currentCardId } = deckContext

    useEffect(() => {
        const titlesLoader = async () => {
            const titlesTuples: Iterable<readonly [number, string]> =
                await invoke("load_card_titles", {
                    deckId: currentDeck,
                })
            setAllTitles(new Map(titlesTuples))
        }

        titlesLoader()
    })

    const options: Options<CardTitleOption> =
        allTitles.size === 0
            ? []
            : Array.from(filteredCards.keys())
                  .filter(
                      (id) =>
                          allTitles.has(id) &&
                          allTitles.get(id)!.indexOf(searchText) > -1
                  )
                  .map((id) => ({
                      label: allTitles.get(id)!,
                      value: allTitles.get(id)!,
                      id: id,
                  }))

    return (
        <Select
            components={{ Option: CustomOption }}
            className="w-full"
            options={options}
            closeMenuOnSelect={true}
            value={null}
            filterOption={createFilter({ ignoreAccents: false })}
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
