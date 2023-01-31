import UserList from "../components/login/UserList"
import { useState, useContext } from "react"
import NewUserForm from "../components/login/NewUserForm"
import { AppLevelContext } from "../types"
import { AppContext } from "../app/App"

function LoginPage() {
    const { users } = useContext(AppContext) as AppLevelContext
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
                <UserList users={Array.from(users.values())} />
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
