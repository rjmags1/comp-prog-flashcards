import React, { useEffect, useState } from "react"
import PageSwitch from "./PageSwitch"
import { AppLevelContext, Page, Tag, TagType, Theme, User } from "../types"
import "react-tooltip/dist/react-tooltip.css"
import { invoke } from "@tauri-apps/api/tauri"

// TODO:
// impl fetching of all user info and all existing tags (tags
// themselves, not their associations with cards)

export const AppContext = React.createContext<AppLevelContext | null>(null)

const tempUsers: User[] = [
    {
        id: 1,
        username: "user1",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 4,
        hideDiffs: false,
    },
    {
        id: 2,
        username: "user2",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 3,
        username: "user3",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 4,
        username: "user4",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 5,
        username: "user5",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 6,
        username: "user6",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 7,
        username: "user7",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
    },
    {
        id: 8,
        username: "user8",
        avatarPath: "./default-avatar.png",
        theme: Theme.Normal,
        tagMask: 0,
        hideDiffs: false,
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
        content: "Some sample content",
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
        themes: [Theme.Normal],
        users: tempUserMap,
        currentUser: 1,
        currentTheme: Theme.Normal,
        pageHistory: [[Page.Login, null]],
        tags: tempTags,
        updater: null,
    })

    const invoker = async () => {
        const asdf = await invoke("load_app_context")
        console.log(asdf)
    }

    useEffect(() => {
        if (appContext.updater !== null) return

        invoker()

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
