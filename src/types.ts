import { ReactNode } from "react"

///////////////////////////
////////// ENUMS //////////
///////////////////////////
export enum Page {
    Login,
    Decks,
    Cards,
    Settings,
}

export enum Difficulty {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}
export const DifficultyLookup: ReadonlyMap<string, Difficulty> = new Map([
    ["Easy", Difficulty.Easy],
    ["Medium", Difficulty.Medium],
    ["Hard", Difficulty.Hard],
])

export enum TagType {
    Paradigm = "Paradigm",
    Concept = "Concept",
    Trick = "Trick",
}

export enum Theme {
    Normal = "Normal",
    Dark = "Dark",
}
export const ThemeLookup: ReadonlyMap<string, Theme> = new Map([
    ["Normal", Theme.Normal],
    ["Dark", Theme.Dark],
])

export enum ScrollDirection {
    Prev,
    Next,
}

enum ColorPalette {
    Emerald = "#047857",
    Sky = "#0ea5e9",
    Purple = "#9333ea",
    Red = "#9f1239",
    Orange = "#ea580c",
    Blue = "#1e40af",
    Salmon = "#ec4899",
    Brown = "#7c2d12",
    Gray = "#3f3f46",
}
export const colors: ReadonlyArray<ColorPalette> = [
    ColorPalette.Emerald,
    ColorPalette.Sky,
    ColorPalette.Purple,
    ColorPalette.Red,
    ColorPalette.Orange,
    ColorPalette.Blue,
    ColorPalette.Salmon,
    ColorPalette.Brown,
    ColorPalette.Gray,
]

///////////////////////////
////////// APP ////////////
///////////////////////////
export type HistoryEntry =
    | [Exclude<Page, Page.Cards>, null]
    | [Page.Cards, number]

export interface Tag {
    id: number
    type: TagType
    name: string
    content: string | null
}

export interface AppLevelContext {
    themes: Theme[]
    users: Map<number, User>
    currentUser: number | null
    currentTheme: Theme
    pageHistory: HistoryEntry[]
    sources: Map<number, Source>
    tags: Map<number, Tag>
    updater: React.Dispatch<React.SetStateAction<AppLevelContext>> | null
}

export interface Source {
    id: number
    name: string
}

export interface TagFetchData {
    id: number
    content: string | null
    name: string
    tag_type: TagType
}

export interface UserFetchData {
    id: number
    username: string
    avatar_path: string
    theme: string
    tagmask: number
    hidediffs: boolean
}

export interface AppContextFetchData {
    tags: TagFetchData[]
    themes: string[]
    users: UserFetchData[]
    sources: Source[]
}

///////////////////////////
////////// GENERAL ////////
///////////////////////////
export interface ExitProps {
    exitCallback: () => void
}

export interface PopupMessageProps {
    message: string
    confirm?: boolean
    unrender: (d?: boolean) => void
    whiteText?: boolean
}

export interface PageHeaderProps {
    header: string
    page: Page
}

export interface ModalProps {
    children: ReactNode
    whiteText?: boolean
    widthVw: number
    heightVh: number
}

export interface AddToDeckModalProps {
    widthVw: number
    heightVh: number
    unrender: () => void
}

///////////////////////////
////////// LOGIN //////////
///////////////////////////
export interface NewUserFormProps {
    unrender: () => void
}

export interface User {
    id: number
    username: string
    avatarPath: string
    theme: Theme
    tagMask: number
    hideDiffs: boolean
}

export interface UserListProps {
    users: User[]
}

///////////////////////////
////////// CARDS //////////
///////////////////////////
export interface CardsPageProps {
    deckId: number
}

export interface CardTagsProps {
    cardData: Card
}

export interface CardFrontProps {
    cardData: Card
}

export interface CardBackProps {
    cardData: Card
}

export interface PromptProps {
    cardData: Card
}

export interface TagProps {
    tagData: Tag
    color: ColorPalette
    remover: () => void
}

export interface AddTagsModalProps {
    cardTags: Tag[]
    unrender: () => void
    adder: (newTags: Tag[]) => void
}

export interface AddCardModalProps {
    unrender: () => void
}

export interface NewCardInfo {
    title: string
    source: string | null
    difficulty: Difficulty
}

export interface AddTagToCardButtonProps {
    cardTags: Tag[]
    adder: (newTags: Tag[]) => void
}

export interface DeckLevelContext {
    currentDeck: number
    cards: Map<number, CardMetadata>
    filteredCards: Map<number, CardMetadata>
    currentCardId: number | null
    filterTags: Set<number>
    updater: React.Dispatch<React.SetStateAction<DeckLevelContext>> | null
}

export interface Tab {
    title: string
    content: string
    index: number
}

export interface NewTabProps {
    addingNew: boolean
    opener: () => void
    saver: (newTitle: string) => void
    discarder: () => void
}

export interface TabProps {
    addingNew: boolean
    title: string
    selectedIndex: number
    index: number
    deletePopupRenderer: () => void
    clickHandler: () => void
}

export interface Card {
    metadata: CardMetadata
    title: string
    prompt: string
    solutions: Solution[]
    notes: string
}

export interface Solution {
    id: number
    name: string
    content: string
}

export interface CardContent {
    card_id: number
    title: string
    prompt: string
    notes: string
    solutions: Solution[]
}

export interface CardMetadata {
    id: number
    front: number
    back: number
    mastered: boolean
    source: string | null
    shipped: boolean
    difficulty: Difficulty
    tags: Set<number>
}

export interface CardFetchMetadata {
    id: number
    front: number
    back: number
    mastered: boolean
    shipped: boolean
    source: string | null
    difficulty: string
    tags: number[]
}

export interface DeckCardsMetadata {
    deck_id: number
    deck_name: string
    card_metadata: CardFetchMetadata[]
}

export interface TagFilterProps {
    tagType: TagType
}

export interface CardHeaderProps {
    cardData: Card
    flipper: () => void
}

export interface ScrollButtonProps {
    direction: ScrollDirection
}

export interface ToggleMasteryButtonProps {
    status: boolean
}

///////////////////////////
////////// DECKS //////////
///////////////////////////
export interface DecksLevelContext {
    decks: Map<number, Deck>
    addingNew: boolean
    updater: React.Dispatch<React.SetStateAction<DecksLevelContext>> | null
}

export interface DecksListProps {
    decks: Deck[]
    renderBlank: boolean
}

export interface DeckProps {
    deck: Deck | null
    blank?: boolean
}

export interface Deck {
    id: number
    name: string
    user: number
    size: number
    mastered: number
}

///////////////////////////
//////// SETTINGS /////////
///////////////////////////
