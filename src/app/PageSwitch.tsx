import CardsPage from "../pages/CardsPage"
import DecksPage from "../pages/DecksPage"
import LoginPage from "../pages/LoginPage"
import SettingsPage from "../pages/SettingsPage"
import { useContext } from "react"
import { AppContext } from "./App"
import { Page } from "../types"

const HISTORY_CAP = 50

function PageSwitch () {
    const appContext = useContext(AppContext)
    if (appContext === null || appContext.updater === null) {
        return null
    }

    const hist = appContext.pageHistory
    const histLen = hist.length

    if (histLen > HISTORY_CAP) {
        appContext.updater({...AppContext, pageHistory: hist.slice(-50)})
        return null
    }

    const entry = hist[histLen - 1]
    switch (true) {
        case entry[0] === Page.Login: {
            return <LoginPage />
        }
        case entry[0] === Page.Decks: {
            return <DecksPage />
        }
        case entry[0] === Page.Settings: {
            return <SettingsPage />
        }
        default: {
            return <CardsPage cardId={entry[1] as number} />
        }
    }
}

export default PageSwitch
