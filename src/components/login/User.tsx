import { AppLevelContext, Page, User } from "../../types"
import { AppContext } from "../../app/App"
import { useContext, useEffect, useState } from "react"
import { appDataDir, join } from "@tauri-apps/api/path"
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { imageDirSetup } from "../../helpers"

function User_(userInfo: User) {
    const appContext = useContext(AppContext) as AppLevelContext
    const { updater, pageHistory } = appContext
    const [imageSrc, setImageSrc] = useState("")

    const clickHandler = () => {
        updater!({
            ...appContext,
            currentUser: userInfo.id,
            pageHistory: [...pageHistory, [Page.Decks, null]],
        })
    }

    useEffect(() => {
        const imagePathToSrc = async () => {
            await imageDirSetup()

            const { avatarPath } = userInfo
            const base = await appDataDir()
            const path = await join(base, avatarPath)
            setImageSrc(convertFileSrc(path))
        }

        imagePathToSrc()
    }, [])

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
                <img src={imageSrc} width="64" />
            </div>
            {userInfo.username}
        </div>
    )
}

export default User_
