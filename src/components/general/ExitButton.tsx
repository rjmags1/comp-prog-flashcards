import { ExitProps } from "../../types"

function ExitButton({ exitCallback }: ExitProps) {
    return (
        <button className="text-3xl" onClick={() => exitCallback()}>
            ✕
        </button>
    )
}

export default ExitButton
