import CardsPage from "../pages/CardsPage"
import DecksPage from "../pages/DecksPage"
import LoginPage from "../pages/LoginPage"
import SettingsPage from "../pages/SettingsPage"
import { useContext } from "react"
import { AppContext } from "./App"
import { Page } from "../types"

const HISTORY_CAP = 50

function PageSwitch() {
    const appContext = useContext(AppContext)
    if (appContext === null || appContext.updater === null) {
        return null
    }

    const hist = appContext.pageHistory
    const histLen = hist.length
    if (histLen > HISTORY_CAP) {
        appContext.updater({ ...AppContext, pageHistory: hist.slice(-50) })
        return null
    }

    const [page, cardId] = hist[histLen - 1]
    switch (page) {
        case Page.Login: {
            return <LoginPage />
        }
        case Page.Decks: {
            return <DecksPage />
        }
        case Page.Settings: {
            return <SettingsPage />
        }
        case Page.Cards: {
            return <CardsPage cardId={cardId} />
        }
        default: {
            throw new Error("invalid page history entry")
        }
    }
}

export default PageSwitch
