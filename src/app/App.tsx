import React, { useEffect, useState } from "react"
import PageSwitch from "./PageSwitch"
import { AppLevelContext, Page, User } from "../types"

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

function App() {
    const [appContext, setAppContext] = useState<AppLevelContext>({
        themes: [],
        users: tempUserMap,
        currentUser: null,
        currentTheme: 0,
        pageHistory: [[Page.Login, null]],
        tags: [],
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
