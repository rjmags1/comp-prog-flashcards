import {
    Card,
    CardMetadata,
    CardsPageProps,
    DeckLevelContext,
    Difficulty,
    AppLevelContext,
    Page,
    DeckCardsMetadata,
    DifficultyLookup,
} from "../types"
import { useState, createContext, useEffect, useContext } from "react"
import PageHeader from "../components/general/PageHeader"
import { AppContext } from "../app/App"
import Deck from "../components/cards/Deck"
import { invoke } from "@tauri-apps/api"

export const DeckContext = createContext<DeckLevelContext | null>(null)

function CardsPage({ deckId }: CardsPageProps) {
    const { users, currentUser } = useContext(AppContext) as AppLevelContext
    const [deckName, setDeckName] = useState("")
    const [deckContext, setDeckContext] = useState<DeckLevelContext>({
        currentDeck: deckId,
        cards: new Map(),
        filteredCards: new Map(),
        currentCardId: null,
        filterTags: new Set(),
        updater: null,
    })

    const deckLoader = async () => {
        try {
            const { card_metadata, deck_name }: DeckCardsMetadata =
                await invoke("load_card_metadata", {
                    deckId,
                })
            const cards: Map<number, CardMetadata> = new Map()
            card_metadata.forEach(
                ({
                    id,
                    front,
                    back,
                    mastered,
                    source,
                    shipped,
                    difficulty,
                    tags,
                }) => {
                    cards.set(id, {
                        id,
                        front,
                        back,
                        mastered,
                        source,
                        shipped,
                        difficulty: DifficultyLookup.get(difficulty)!,
                        tags: new Set(tags),
                    })
                }
            )
            const filteredCards = new Map(cards)
            setDeckContext((initialDeckContext) => ({
                ...initialDeckContext,
                cards,
                filteredCards,
                currentCardId: card_metadata[0].id,
                updater: setDeckContext,
            }))
            setDeckName(deck_name)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (deckContext.updater === null) {
            deckLoader()
        }
    })

    return (
        <DeckContext.Provider value={deckContext}>
            <PageHeader
                page={Page.Cards}
                header={`${users.get(currentUser!)?.username} - ${deckName}`}
            />
            {deckContext.currentCardId && <Deck />}
        </DeckContext.Provider>
    )
}

export default CardsPage
