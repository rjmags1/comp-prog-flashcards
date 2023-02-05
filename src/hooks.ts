import { useState, useEffect, useRef, useCallback } from "react"

export function useOutsideClickHandler(initRendered: boolean) {
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

export function useCardFrontHandleResize() {
    const [_, setTicker] = useState(0)

    const cardHeight = document.getElementById("card")?.getBoundingClientRect()
        .height!
    const tagsHeight = document
        .getElementById("card-tags")
        ?.getBoundingClientRect().height!
    const headerHeight = document
        .getElementById("card-header")
        ?.getBoundingClientRect().height!
    const size = cardHeight - tagsHeight - headerHeight - 7.5

    const tick = useCallback(() => setTicker((t) => t + 1), [])

    useEffect(() => {
        window.addEventListener("resize", tick)
        return () => window.removeEventListener("resize", tick)
    }, [])

    return size
}

export function useCardBackHandleResize() {
    const [_, setTicker] = useState(0)
    const tick = useCallback(() => setTicker((t) => t + 1), [])

    useEffect(() => {
        window.addEventListener("resize", tick)
        return () => window.removeEventListener("resize", tick)
    }, [])

    const cardHeight = document.getElementById("card")?.getBoundingClientRect()
        .height!
    const tagsHeight = document
        .getElementById("card-tags")
        ?.getBoundingClientRect().height!
    const headerHeight = document
        .getElementById("card-header")
        ?.getBoundingClientRect().height!
    const tabsHeight = document.getElementById("tabs")?.getBoundingClientRect()
        .height!
    const size = cardHeight - tagsHeight - headerHeight - tabsHeight - 7.5

    return size
}
