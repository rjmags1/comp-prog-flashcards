import { useContext } from "react"
import { AppContext } from "../../app/App"
import { AppLevelContext, Page } from "../../types"

function BackButton() {
    const appContext = useContext(AppContext) as AppLevelContext
    const { pageHistory, updater, currentUser } = appContext

    const clickHandler = () => {
        let newHistory = [...pageHistory]
        const currPage = pageHistory[pageHistory.length - 1][0]
        switch (currPage) {
            case Page.Decks: {
                newHistory.push([Page.Login, null])
                break
            }
            case Page.Cards: {
                newHistory.push([Page.Decks, null])
                break
            }
            case Page.Settings: {
                newHistory.pop()
                break
            }
            default: {
                throw new Error("back button rendered on login page")
            }
        }
        updater!({
            ...appContext,
            pageHistory: newHistory,
            currentUser: currPage === Page.Decks ? null : currentUser,
        })
    }

    return (
        <button
            onClick={clickHandler}
            className="text-4xl text-white hover:opacity-50"
        >
            ←
        </button>
    )
}

export default BackButton
