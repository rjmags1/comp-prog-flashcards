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

export enum TagType {
    Paradigm = "Paradigm",
    Concept = "Concept",
    Trick = "Trick",
}

export enum Theme {
    Default,
}

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
    tags: Map<number, Tag>
    updater: React.Dispatch<React.SetStateAction<AppLevelContext>> | null
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
    theme: number
    tagMask: number
    hideDiffMask: number
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

export interface AddTagToCardButtonProps {
    cardTags: Tag[]
    adder: (newTags: Tag[]) => void
}

export interface DeckLevelContext {
    currentDeck: number
    cards: Map<number, CardMetadata>
    displayedCards: Map<number, CardMetadata>
    currentCardId: number
    addingNew: boolean
    filterTags: Set<number>
    updater: React.Dispatch<React.SetStateAction<DeckLevelContext>> | null
}

export interface Card {
    metadata: CardMetadata
    title: string
    prompt: string
    solution: string
    notes: string
}

export interface CardMetadata {
    id: number
    front: number
    back: number
    mastered: boolean
    source: number
    shipped: boolean
    difficulty: Difficulty
    tags: Set<number>
}

export interface TagFilterProps {
    tagType: TagType
}

export interface TagFilterOptionProps {
    id: number
    tag: Tag
}

export interface CardHeaderProps {
    cardData: Card
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
    deleted: boolean
    user: number
    size: number
    mastered: number
}

///////////////////////////
//////// SETTINGS /////////
///////////////////////////
