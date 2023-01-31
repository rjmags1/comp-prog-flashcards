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
    Easy,
    Medium,
    Hard,
}

export enum TagType {
    Paradigm,
    Concept,
    Trick,
}

export enum Theme {
    Default,
}

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
    content: string
}

export interface AppLevelContext {
    themes: Theme[]
    users: Map<number, User>
    currentUser: number | null
    currentTheme: Theme
    pageHistory: HistoryEntry[]
    tags: Tag[]
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
    cardId: number
}

///////////////////////////
////////// DECKS //////////
///////////////////////////

///////////////////////////
//////// SETTINGS /////////
///////////////////////////
