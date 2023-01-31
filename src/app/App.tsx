import React, { useEffect, useState } from "react"
import PageSwitch from "./PageSwitch"
import { AppLevelContext, Page } from "../types"

// TODO:
// impl fetching of all user info and all existing tags (tags
// themselves, not their associations with cards)

export const AppContext = React.createContext<AppLevelContext | null>(null)

function App() {
    const [appContext, setAppContext] = useState<AppLevelContext>({
        themes: [],
        userIds: [],
        currentUserInfo: null,
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
