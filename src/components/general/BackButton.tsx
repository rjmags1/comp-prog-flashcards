import { useContext } from "react"
import { AppContext } from "../../app/App"
import { AppLevelContext, Page } from "../../types"

function BackButton() {
    const appContext = useContext(AppContext) as AppLevelContext
    const { pageHistory, updater, currentUser } = appContext

    const clickHandler = () => {
        let newHistory = [...pageHistory]
        const currPage = pageHistory[pageHistory.length - 1][0]
        if (currPage === Page.Login) {
            throw new Error("back button rendered on login page")
        } else {
            newHistory.pop()
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
