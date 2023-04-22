import { useState, useContext } from "react"
import {
    AppLevelContext,
    NewUserFormProps,
    UserFetchData,
    ThemeLookup,
} from "../../types"
import ExitButton from "../general/ExitButton"
import PopupMessage from "../general/PopupMessage"
import { invoke } from "@tauri-apps/api"
import { AppContext } from "../../app/App"
import {
    writeBinaryFile,
    exists,
    BaseDirectory,
    createDir,
} from "@tauri-apps/api/fs"

const DEFAULT_AVATAR_NAME = "default"
const DEFAULT_AVATAR_PATH = "images/default-avatar.png"

function NewUserForm({ unrender }: NewUserFormProps) {
    const [username, setUsername] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [prefillDeck, setPrefillDeck] = useState(true)
    const [renderPopup, setRenderPopup] = useState(false)
    const [addFailMsg, setAddFailMsg] = useState("")
    const appContext = useContext(AppContext) as AppLevelContext

    const addUser = async () => {
        try {
            let avatarPath = DEFAULT_AVATAR_PATH
            if (imageFile) {
                avatarPath = `images/${imageFile.name}`
                if (
                    !(await exists(avatarPath, { dir: BaseDirectory.AppData }))
                ) {
                    if (
                        !(await exists("images", {
                            dir: BaseDirectory.AppData,
                        }))
                    ) {
                        await createDir("images", {
                            dir: BaseDirectory.AppData,
                            recursive: true,
                        })
                    }
                    const arrayBuffer = await imageFile.arrayBuffer()
                    await writeBinaryFile(avatarPath, arrayBuffer, {
                        dir: BaseDirectory.AppData,
                    })
                }
            }
            const newUser: UserFetchData = await invoke("add_user", {
                username,
                defaultAvatar: !imageFile,
                avatarPath,
                avatarName: imageFile?.name || DEFAULT_AVATAR_NAME,
                prefillDeck,
            })
            const { updater, users } = appContext
            const newUsers = new Map(users)
            const {
                id,
                username: username_,
                avatar_path,
                theme,
                tagmask,
                hidediffs,
            } = newUser
            newUsers.set(newUser.id, {
                id,
                username: username_,
                avatarPath: avatar_path,
                theme: ThemeLookup.get(theme)!,
                tagMask: tagmask,
                hideDiffs: hidediffs,
            })
            updater!({
                ...appContext,
                users: newUsers,
            })

            setUsername("")
            setImageFile(null)
            setPrefillDeck(true)
            setRenderPopup(false)
            setAddFailMsg("")
            unrender()
        } catch (e) {
            setAddFailMsg(
                `User add failed due to ${e}. Cannot have two users with the same name.`
            )
            setRenderPopup(true)
        }
    }

    return (
        <div
            className="absolute z-10 flex w-fit flex-col 
            items-start justify-center gap-y-5 rounded-lg border border-white 
            bg-stone-800 p-10 drop-shadow-2xl"
        >
            <div className="flex w-full justify-between">
                <h2 className="text-4xl font-bold">New User</h2>
                <div className="-mt-1">
                    <ExitButton exitCallback={unrender} />
                </div>
            </div>
            <div className="flex gap-x-2">
                Username:
                <input
                    className="rounded-sm px-1 text-black outline-none"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="flex w-fit gap-x-2">
                Avatar:
                <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                    }
                />
            </div>
            <div className="flex items-center gap-x-3">
                Prefill a deck with Leetcode questions?
                <input
                    className="hover:cursor-pointer"
                    type="checkbox"
                    checked={prefillDeck}
                    onChange={(e) => setPrefillDeck(e.target.checked)}
                />
            </div>
            <button
                className="my-2 w-full rounded border border-white 
                bg-green-500 py-1 hover:cursor-pointer hover:bg-green-800
                disabled:hover:cursor-default disabled:hover:bg-green-500"
                disabled={renderPopup}
                onClick={addUser}
            >
                Add
            </button>
            {renderPopup && (
                <PopupMessage
                    confirm
                    message={addFailMsg}
                    unrender={() => setRenderPopup(false)}
                />
            )}
        </div>
    )
}

export default NewUserForm
