import {
    Card,
    CardMetadata,
    CardsPageProps,
    DeckLevelContext,
    Difficulty,
    AppLevelContext,
    Page,
} from "../types"
import { useState, createContext, useEffect, useContext } from "react"
import PageHeader from "../components/general/PageHeader"
import { AppContext } from "../app/App"
import Deck from "../components/cards/Deck"

// TODO:
//    - tauri command for fetching deck name all card metadata
//        - for the deck with deckId

const cards: CardMetadata[] = [
    {
        id: 1,
        front: 1,
        back: 1,
        mastered: true,
        source: 1,
        shipped: true,
        difficulty: Difficulty.Easy,
        tags: new Set([1, 2, 3]),
    },
    {
        id: 2,
        front: 2,
        back: 2,
        mastered: false,
        source: 1,
        shipped: false,
        difficulty: Difficulty.Medium,
        tags: new Set([1, 2, 3, 4]),
    },
    {
        id: 3,
        front: 3,
        back: 3,
        mastered: true,
        source: 1,
        shipped: false,
        difficulty: Difficulty.Hard,
        tags: new Set([7, 9, 11]),
    },
    {
        id: 4,
        front: 4,
        back: 4,
        mastered: true,
        source: 1,
        shipped: false,
        difficulty: Difficulty.Easy,
        tags: new Set([12, 21]),
    },
    {
        id: 5,
        front: 5,
        back: 5,
        mastered: false,
        source: 1,
        shipped: true,
        difficulty: Difficulty.Medium,
        tags: new Set([101, 20]),
    },
]

const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed risus ultricies tristique nulla aliquet enim. Quam adipiscing vitae proin sagittis. Tempor orci dapibus ultrices in iaculis nunc sed. Volutpat odio facilisis mauris sit amet massa vitae tortor condimentum. Volutpat sed cras ornare arcu dui vivamus. Elementum tempus egestas sed sed risus pretium quam vulputate. Feugiat in fermentum posuere urna nec tincidunt praesent. Amet mattis vulputate enim nulla aliquet porttitor lacus. Vivamus at augue eget arcu dictum varius duis at consectetur. Ac placerat vestibulum lectus mauris. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Nunc congue nisi vitae suscipit tellus mauris a diam. Sed tempus urna et pharetra pharetra massa. Pellentesque habitant morbi tristique senectus. Ultricies lacus sed turpis tincidunt id. Molestie nunc non blandit massa enim nec dui. Cursus in hac habitasse platea dictumst quisque sagittis purus. Nullam non nisi est sit amet facilisis magna etiam.\nCras ornare arcu dui vivamus arcu. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Risus pretium quam vulputate dignissim suspendisse. Iaculis urna id volutpat lacus laoreet non curabitur gravida. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget. Adipiscing diam donec adipiscing tristique risus. Pharetra magna ac placerat vestibulum lectus mauris. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Urna nunc id cursus metus aliquam eleifend mi in nulla. Ornare suspendisse sed nisi lacus sed viverra tellus in hac. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida."
const samplePrompt =
    '<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in <strong>any order</strong>.</p>\n\n<p>A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.</p>\n<img alt="" src="https://assets.leetcode.com/uploads/2022/03/15/1200px-telephone-keypad2svg.png" style="width: 300px; height: 243px;" />\n<p>&nbsp;</p>\n<p><strong class="ex…\n\n<pre>\n<strong>Input:</strong> digits = &quot;&quot;\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class="example">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = &quot;2&quot;\n<strong>Output:</strong> [&quot;a&quot;,&quot;b&quot;,&quot;c&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= digits.length &lt;= 4</code></li>\n\t<li><code>digits[i]</code> is a digit in the range <code>[&#39;2&#39;, &#39;9&#39;]</code>.</li>\n</ul>\n'
const tempCardsMap: Map<number, CardMetadata> = new Map()
cards.forEach((card) => tempCardsMap.set(card.id, card))
export const tempCard: Card = {
    metadata: cards[0],
    title: "tempTitle",
    prompt: samplePrompt,
    solution: "# Some Solution in Markdown\n\n" + lorem,
    notes: "### Some Notes in Markdown\n\n" + lorem,
}

export const DeckContext = createContext<DeckLevelContext | null>(null)

function CardsPage({ deckId }: CardsPageProps) {
    const { users, currentUser } = useContext(AppContext) as AppLevelContext
    const [deckName, setDeckName] = useState("")
    const [deckContext, setDeckContext] = useState<DeckLevelContext>({
        currentDeck: deckId,
        cards: tempCardsMap,
        displayedCards: new Map(tempCardsMap),
        currentCardId: 1,
        addingNew: false,
        filterTags: new Set(),
        updater: null,
    })

    useEffect(() => {
        if (deckName === "") {
            // tauri command to get deck data
            setDeckName("deck1")
        }
        if (deckContext.updater === null) {
            setDeckContext({
                ...deckContext,
                updater: setDeckContext,
            })
            return
        }
    })

    return (
        <DeckContext.Provider value={deckContext}>
            <PageHeader
                page={Page.Cards}
                header={`${users.get(currentUser!)?.username} - ${deckName}`}
            />
            <Deck />
        </DeckContext.Provider>
    )
}

export default CardsPage
