import React, { useEffect, useState } from "react"
import PageSwitch from "./PageSwitch"
import { AppLevelContext, Page, Tag, TagType, User } from "../types"

// TODO:
// impl fetching of all user info and all existing tags (tags
// themselves, not their associations with cards)

export const AppContext = React.createContext<AppLevelContext | null>(null)

const tempUsers: User[] = [
    {
        id: 1,
        username: "user1",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 2,
        username: "user2",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 3,
        username: "user3",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 4,
        username: "user4",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 5,
        username: "user5",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 6,
        username: "user6",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 7,
        username: "user7",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 8,
        username: "user8",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
]

const tempUserMap = new Map()
tempUsers.forEach((user) => {
    tempUserMap.set(user.id, user)
})

const tags: Tag[] = [
    {
        id: 1,
        type: TagType.Paradigm,
        name: "graph",
        content: null,
    },
    {
        id: 2,
        type: TagType.Paradigm,
        name: "dynamic programming",
        content: null,
    },
    {
        id: 3,
        type: TagType.Concept,
        name: "sorting",
        content: null,
    },
    {
        id: 4,
        type: TagType.Concept,
        name: "bit mask",
        content: null,
    },
    {
        id: 5,
        type: TagType.Trick,
        name: "pythagorean theorem",
        content: "a ** 2 + b ** 2 = c ** 2",
    },
    {
        id: 6,
        type: TagType.Trick,
        name: "quickselect",
        content: "find element at sorted index in average linear time",
    },
]
const tempTags = new Map()
tags.forEach((t) => tempTags.set(t.id, t))

function App() {
    const [appContext, setAppContext] = useState<AppLevelContext>({
        themes: [],
        users: tempUserMap,
        currentUser: 1,
        currentTheme: 0,
        pageHistory: [[Page.Cards, 1]],
        tags: tempTags,
        updater: null,
    })

    useEffect(() => {
        if (appContext.updater !== null) return

        setAppContext((initialAppContext) => ({
            ...initialAppContext,
            updater: setAppContext,
        }))
    })

    return (
        <div className="h-full w-full bg-slate-900 text-white">
            <AppContext.Provider value={appContext}>
                <PageSwitch />
            </AppContext.Provider>
        </div>
    )
}

export default App
