import React, { useEffect, useState } from "react"
import PageSwitch from "./PageSwitch"
import {
    AppContextFetchData,
    AppLevelContext,
    Page,
    Source,
    Tag,
    Theme,
    ThemeLookup,
    User,
} from "../types"
import "react-tooltip/dist/react-tooltip.css"
import { invoke } from "@tauri-apps/api/tauri"

export const AppContext = React.createContext<AppLevelContext | null>(null)

function App() {
    const [appContext, setAppContext] = useState<AppLevelContext>({
        themes: [],
        users: new Map(),
        currentUser: null,
        sources: new Map(),
        currentTheme: Theme.Normal,
        pageHistory: [[Page.Login, null]],
        tags: new Map(),
        updater: null,
    })

    useEffect(() => {
        if (appContext.updater !== null) return

        const appContextSetter = async () => {
            const { tags, themes, users, sources } = (await invoke(
                "load_app_context"
            )) as AppContextFetchData
            const newTags: Map<number, Tag> = new Map()
            tags.forEach(({ id, tag_type, name, content }) =>
                newTags.set(id, {
                    type: tag_type,
                    id: id,
                    name: name,
                    content: content,
                })
            )
            const newThemes: Theme[] = []
            themes.forEach((theme) => {
                if (!ThemeLookup.has(theme)) {
                    throw new Error("need to add valid TS typing for new theme")
                }
                newThemes.push(ThemeLookup.get(theme)!)
            })
            const newUsers: Map<number, User> = new Map()
            users.forEach(
                ({ id, username, avatar_path, theme, tagmask, hidediffs }) =>
                    newUsers.set(id, {
                        id,
                        username,
                        avatarPath: avatar_path,
                        theme: theme as Theme,
                        tagMask: tagmask,
                        hideDiffs: hidediffs,
                    })
            )
            const newSources: Map<number, Source> = new Map()
            sources.forEach((source) => newSources.set(source.id, source))

            setAppContext((initialAppContext) => ({
                ...initialAppContext,
                tags: newTags,
                themes: newThemes,
                users: newUsers,
                sources: newSources,
                updater: setAppContext,
            }))
        }

        appContextSetter()
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
