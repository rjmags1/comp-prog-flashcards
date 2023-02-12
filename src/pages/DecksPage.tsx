import { useContext, createContext, useState, useEffect } from "react"
import { AppContext } from "../app/App"
import DecksList from "../components/decks/DecksList"
import PageHeader from "../components/general/PageHeader"
import { AppLevelContext, Deck, DecksLevelContext, Page } from "../types"
import { invoke } from "@tauri-apps/api"

export const DecksContext = createContext<DecksLevelContext | null>(null)

function DecksPage() {
    const { users, currentUser } = useContext(AppContext) as AppLevelContext
    const [decksContext, setDeckContext] = useState<DecksLevelContext>({
        decks: new Map(),
        addingNew: false,
        updater: null,
    })

    useEffect(() => {
        if (decksContext.updater !== null) return

        const decksSetter = async () => {
            const deckData: { decks: Deck[] } = await invoke(
                "load_user_decks",
                {
                    userId: users.get(currentUser!)!.id,
                }
            )
            const { decks: decksArr } = deckData
            const decks = new Map(decksArr.map((d) => [d.id, d]))
            setDeckContext((initialDecksContext) => ({
                ...initialDecksContext,
                updater: setDeckContext,
                decks,
            }))
        }

        decksSetter()
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
