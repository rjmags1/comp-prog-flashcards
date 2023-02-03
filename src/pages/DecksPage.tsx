import { useContext, createContext, useState, useEffect } from "react"
import { AppContext } from "../app/App"
import DecksList from "../components/decks/DecksList"
import PageHeader from "../components/general/PageHeader"
import { AppLevelContext, Deck, DecksLevelContext, Page } from "../types"

// TODO:
//    - impl tauri command to fetch all info about user deck

export const tempDecks: Deck[] = [
    {
        id: 1,
        name: "deck1",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 2,
        name: "deck2",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 3,
        name: "deck3",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 4,
        name: "deck4",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 5,
        name: "deck5",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 6,
        name: "deck6",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 7,
        name: "deck7",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 8,
        name: "deck8",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 9,
        name: "deck9",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 10,
        name: "deck10",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 11,
        name: "deck11",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 12,
        name: "deck12",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 13,
        name: "deck13",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
    {
        id: 14,
        name: "deck14",
        deleted: false,
        user: 1,
        size: 2000,
        mastered: 44,
    },
]

const tempDecksMap = new Map()
tempDecks.forEach((deck) => tempDecksMap.set(deck.id, deck))

export const DecksContext = createContext<DecksLevelContext | null>(null)

function DecksPage() {
    const { users, currentUser } = useContext(AppContext) as AppLevelContext
    const [decksContext, setDeckContext] = useState<DecksLevelContext>({
        decks: tempDecksMap,
        addingNew: false,
        updater: null,
    })

    useEffect(() => {
        if (decksContext.updater !== null) return

        setDeckContext((initialDecksContext) => ({
            ...initialDecksContext,
            updater: setDeckContext,
        }))
    })

    const header = `${users.get(currentUser as number)!.username}'s Decks`
    return (
        <div className="h-full w-full px-8">
            <DecksContext.Provider value={decksContext}>
                <PageHeader header={header} page={Page.Decks} />
                <DecksList
                    decks={Array.from(decksContext.decks.values())}
                    renderBlank={decksContext.addingNew}
                />
            </DecksContext.Provider>
        </div>
    )
}

export default DecksPage
