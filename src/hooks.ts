import { useState, useEffect, useRef } from "react"

export default function useOutsideClickHandler(initRendered: boolean) {
    const [render, setRender] = useState(initRendered)
    const ref = useRef<HTMLElement | null>(null)

    const handleClickOutside = (e: Event) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setRender(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    }, [])

    return { ref, render, setRender }
}
