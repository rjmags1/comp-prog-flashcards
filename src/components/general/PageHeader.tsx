import { PageHeaderProps, Page } from "../../types"
import AddCardButton from "../cards/AddCardButton"
import AddDeckButton from "../decks/AddDeckButton"
import BackButton from "./BackButton"
import SettingsButton from "./SettingsButton"

function PageHeader({ header, page }: PageHeaderProps) {
    return (
        <div className="flex h-[10%] items-center justify-between px-10">
            <BackButton />
            <h1 className="text-4xl">{header}</h1>
            <div className="flex items-center gap-x-6">
                <SettingsButton />
                {page === Page.Decks && <AddDeckButton />}
                {page === Page.Cards && <AddCardButton />}
            </div>
        </div>
    )
}

export default PageHeader
