import { ExitProps } from "../../types"

function Exit({ exitCallback }: ExitProps) {
    return (
        <button className="text-3xl" onClick={() => exitCallback()}>
            ✕
        </button>
    )
}

export default Exit
