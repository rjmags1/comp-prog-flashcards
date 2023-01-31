import { useContext } from "react"
import { AppContext } from "../../app/App"
import { AppLevelContext, Page } from "../../types"

function SettingsButton() {
    const appContext = useContext(AppContext) as AppLevelContext
    const { updater, pageHistory } = appContext

    const clickHandler = () => {
        updater!({
            ...appContext,
            pageHistory: [...pageHistory, [Page.Settings, null]],
        })
    }

    return (
        <button onClick={clickHandler} className="text-3xl hover:opacity-50">
            ⚙
        </button>
    )
}

export default SettingsButton
