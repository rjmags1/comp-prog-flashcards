import { PageHeaderProps } from "../../types"
import AddDeckButton from "../decks/AddDeckButton"
import BackButton from "./BackButton"
import SettingsButton from "./SettingsButton"

function PageHeader({ header }: PageHeaderProps) {
    return (
        <div className="sticky flex h-[10%] items-center justify-between px-10">
            <BackButton />
            <h1 className="text-4xl">{header}</h1>
            <div className="flex items-center gap-x-6">
                <SettingsButton />
                <AddDeckButton />
            </div>
        </div>
    )
}

export default PageHeader