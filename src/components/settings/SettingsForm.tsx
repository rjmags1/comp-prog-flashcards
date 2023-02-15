import { invoke } from "@tauri-apps/api"
import { useContext, useState } from "react"
import Select from "react-select"
import { AppContext } from "../../app/App"
import { AppLevelContext, Page, TagType, Theme, ThemeLookup } from "../../types"
import PopupMessage from "../general/PopupMessage"

type ThemeOption = {
    label: string
    value: string
}

type TagTypeOption = {
    label: string
    value: string
    bit: number
}

const tagTypeOptions: TagTypeOption[] = [
    {
        value: TagType.Paradigm as string,
        label: TagType.Paradigm as string,
        bit: 1,
    },
    {
        value: TagType.Concept as string,
        label: TagType.Concept as string,
        bit: 2,
    },
    {
        value: TagType.Trick as string,
        label: TagType.Trick as string,
        bit: 4,
    },
]

function SettingsForm() {
    const [renderPopup, setRenderPopup] = useState(false)
    const appContext = useContext(AppContext) as AppLevelContext
    const { themes, currentTheme, updater, users, currentUser, pageHistory } =
        appContext

    const themeOptions: ThemeOption[] = themes
        .filter((t) => t !== currentTheme)
        .map((t) => ({
            label: t as string,
            value: t as string,
        }))

    const userInfo = users.get(currentUser!)!
    const tagMask = userInfo.tagMask
    const hiddenTags: TagTypeOption[] = []
    if (tagMask & 1) hiddenTags.push(tagTypeOptions[0])
    if (tagMask & 2) hiddenTags.push(tagTypeOptions[1])
    if (tagMask & 4) hiddenTags.push(tagTypeOptions[2])

    const updateTheme = async (newTheme: ThemeOption) => {
        try {
            await invoke("update_theme", {
                userId: currentUser,
                theme: newTheme.value,
            })

            updater!({
                ...appContext,
                currentTheme: ThemeLookup.get(newTheme.value)!,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const updateHideDifficulty = async (hidediffs: boolean) => {
        try {
            await invoke("update_hide_difficulty", {
                userId: currentUser,
                hidediffs,
            })

            const updatedUser = {
                ...userInfo,
                hidediffs,
            }
            const newUsers = new Map(users)
            newUsers.set(currentUser!, updatedUser)
            updater!({
                ...appContext,
                users: newUsers,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const updateTagmask = async (tagmask: number) => {
        try {
            await invoke("update_tag_mask", {
                userId: currentUser,
                tagmask,
            })

            const updatedUser = {
                ...userInfo,
                tagMask: tagmask,
            }
            const newUsers = new Map(users)
            newUsers.set(currentUser!, updatedUser)
            updater!({
                ...appContext,
                users: newUsers,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const doDelete = async () => {
        try {
            await invoke("delete_user", {
                userId: currentUser,
            })

            const newUsers = new Map(users)
            newUsers.delete(currentUser!)
            updater!({
                ...appContext,
                users: newUsers,
                pageHistory: [...pageHistory, [Page.Login, null]],
                currentUser: null,
            })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div
            className="no-scrollbar flex h-[90%] flex-col 
            items-center justify-center overflow-y-scroll"
        >
            <div
                className="flex h-full min-w-[400px] max-w-[80%] 
                flex-col items-start justify-start py-12 text-left"
            >
                <h5 className="mb-2 text-xl italic">Change Theme:</h5>
                <Select
                    defaultValue={currentTheme}
                    value={currentTheme}
                    placeholder={currentTheme}
                    isSearchable={false}
                    options={themeOptions as any}
                    className="w-full min-w-[300px] text-black"
                    onChange={(newOption) =>
                        updateTheme(newOption! as unknown as ThemeOption)
                    }
                    styles={{
                        input: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                        }),
                        control: (baseStyles, state) => ({
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: ".375rem",
                        }),
                        container: (baseStyles, state) => ({
                            ...baseStyles,
                            marginBottom: "1.5rem",
                        }),
                        placeholder: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "black",
                        }),
                    }}
                />
                <div className="mb-6 flex gap-x-2">
                    <h5 className="text-xl italic">Hide difficulty:</h5>
                    <input
                        type="checkbox"
                        className="w-5 outline-none"
                        onChange={(e) => updateHideDifficulty(e.target.checked)}
                    />
                </div>
                <h5 className="mb-2 text-xl italic">Hide tags:</h5>
                <Select
                    isMulti={true}
                    isSearchable={false}
                    defaultValue={hiddenTags}
                    closeMenuOnSelect={false}
                    options={tagTypeOptions as any}
                    className="w-full min-w-[300px] text-black"
                    onChange={(selectedTagTypeOptions) => {
                        updateTagmask(
                            selectedTagTypeOptions
                                .map((t) => t.bit)
                                .reduce((mask, bit) => (mask += bit), 0)
                        )
                    }}
                    styles={{
                        input: (baseStyles, state) => ({
                            ...baseStyles,
                            outline: "none",
                        }),
                        control: (baseStyles, state) => ({
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: ".375rem",
                        }),
                        container: (baseStyles, state) => ({
                            ...baseStyles,
                            marginBottom: "1.5rem",
                        }),
                    }}
                />
                <button
                    className="my-6 w-full rounded-md bg-gray-500 p-2 
                    text-white hover:bg-gray-800"
                    onClick={() =>
                        updater!({
                            ...appContext,
                            pageHistory: [...pageHistory, [Page.Login, null]],
                            currentUser: null,
                        })
                    }
                >
                    Log out
                </button>
                <button
                    className="w-full rounded-md bg-red-500 p-2 
                    hover:bg-red-800"
                    onClick={() => setRenderPopup(true)}
                >
                    Delete user
                </button>
            </div>
            {renderPopup && (
                <PopupMessage
                    message="Are you sure you want to delete the current account?"
                    whiteText
                    unrender={(d?: boolean) => {
                        setRenderPopup(false)
                        if (d) doDelete()
                    }}
                />
            )}
        </div>
    )
}

export default SettingsForm
