import { CardMetadata } from "./types"
import {
    appDataDir,
    BaseDirectory,
    join,
    resolveResource,
} from "@tauri-apps/api/path"
import { exists, createDir, copyFile } from "@tauri-apps/api/fs"

export const nextCardId = (
    currCardId: number,
    cardIds: Map<number, CardMetadata>,
    step: number
) => {
    const arrCardIds = Array.from(cardIds.keys())
    const i = arrCardIds.indexOf(currCardId)
    let j = i === -1 ? 0 : i + step
    if (j === -1 || j === arrCardIds.length) {
        j = j === -1 ? arrCardIds.length - 1 : 0
    }

    return arrCardIds[j]
}

export const imageDirSetup = async () => {
    const base = await appDataDir()
    const defaultAvatarPath = await join(base, "images", "default-avatar.png")
    if (!(await exists(defaultAvatarPath))) {
        try {
            await createDir("images", {
                dir: BaseDirectory.AppData,
                recursive: true,
            })
            const defaultAvatarResourcePath = await resolveResource(
                "resources/default-avatar.png"
            )
            await copyFile(defaultAvatarResourcePath, defaultAvatarPath, {
                dir: BaseDirectory.AppData,
            })
        } catch (e) {
            console.error(e)
        }
    }
}
