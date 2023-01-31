import User from "./User"
import { UserListProps } from "../../types"

function UserList({ users }: UserListProps) {
    return (
        <div
            className="flex max-w-screen-sm flex-wrap items-center 
            justify-center gap-x-8 gap-y-4"
        >
            {users.map((userInfo) => (
                <User key={userInfo.id} {...userInfo} />
            ))}
        </div>
    )
}

export default UserList
