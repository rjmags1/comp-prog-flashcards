import { AppLevelContext, Page, User } from "../../types"
import { AppContext } from "../../app/App"
import { useContext } from "react"

function User_(userInfo: User) {
    const appContext = useContext(AppContext) as AppLevelContext
    const { updater, pageHistory } = appContext

    const clickHandler = () => {
        updater!({
            ...appContext,
            currentUser: userInfo.id,
            pageHistory: [...pageHistory, [Page.Decks, null]],
        })
    }

    const { avatarPath, username } = userInfo
    return (
        <div
            className="flex flex-col items-center justify-center text-sm
            hover:opacity-50"
            onClick={clickHandler}
        >
            <div
                className="flex items-center justify-center
                 overflow-hidden rounded-full hover:cursor-pointer"
            >
                <img src={avatarPath} width="64" />
            </div>
            {username}
        </div>
    )
}

export default User_
