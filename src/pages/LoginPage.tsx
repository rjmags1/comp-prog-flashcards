import UserList from "../components/login/UserList"
import { useState } from "react"
import NewUserForm from "../components/login/NewUserForm"
import { User } from "../types"

// temp data for building static version
const users: User[] = [
    {
        id: 1,
        username: "user1",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 2,
        username: "user2",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 3,
        username: "user3",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 4,
        username: "user4",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 5,
        username: "user5",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 6,
        username: "user6",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 7,
        username: "user7",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
    {
        id: 8,
        username: "user8",
        avatarPath: "./default-avatar.png",
        theme: 0,
        tagMask: 0,
        hideDiffMask: 0,
    },
]

function LoginPage() {
    const [showNewUserForm, setShowNewUserForm] = useState(false)

    return (
        <div className="flex h-full w-full items-center justify-center px-8">
            {showNewUserForm && (
                <NewUserForm unrender={() => setShowNewUserForm(false)} />
            )}
            <div
                className="flex h-full w-full
                flex-col items-center justify-center gap-y-8 text-lg"
            >
                <h1 className="text-center text-6xl">
                    Competitive Programming Flashcards
                </h1>
                <h3>
                    <em>Sign in</em>
                </h3>
                <UserList users={users} />
                <button
                    className="rounded-lg border-[1px] 
                    border-white bg-green-500 px-4 py-0.5 hover:bg-green-800 
                    disabled:hover:cursor-default disabled:hover:bg-green-500"
                    onClick={() => setShowNewUserForm(true)}
                    disabled={showNewUserForm}
                >
                    + Add User
                </button>
            </div>
        </div>
    )
}

export default LoginPage
