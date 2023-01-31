import { useContext } from "react"
import { AppContext } from "../../app/App"
import { AppLevelContext, Page } from "../../types"

function BackButton() {
    const appContext = useContext(AppContext) as AppLevelContext
    const { pageHistory, updater } = appContext

    const clickHandler = () => {
        updater!({
            ...appContext,
            pageHistory: [...pageHistory, [Page.Login, null]],
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
