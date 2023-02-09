import { AppContext } from "../app/App"
import { AppLevelContext, Page } from "../types"
import { useContext } from "react"
import PageHeader from "../components/general/PageHeader"
import SettingsForm from "../components/settings/SettingsForm"

function SettingsPage() {
    const appContext = useContext(AppContext) as AppLevelContext
    const { currentUser, users } = appContext
    return (
        <>
            <PageHeader
                header={`${users.get(currentUser!)!.username} - Settings`}
                page={Page.Settings}
            />
            <SettingsForm />
        </>
    )
}

export default SettingsPage
