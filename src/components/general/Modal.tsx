import { ModalProps } from "../../types"

function Modal({ children, whiteText, widthVw, heightVh }: ModalProps) {
    const style: React.CSSProperties = {
        color: whiteText ? "white" : "",
        width: `${widthVw}vw`,
        height: `${heightVh}vh`,
        marginLeft: `${-(widthVw / 2)}vw`,
        marginTop: `${-(heightVh / 2)}vh`,
    }
    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10">
            <div
                style={style}
                className="no-scrollbar fixed top-[50%] left-[50%] z-10 flex 
                flex-col items-center justify-center overflow-hidden overflow-y-scroll
                rounded-md border border-gray-300 bg-stone-800 px-6 text-base drop-shadow-xl"
            >
                {children}
            </div>
        </div>
    )
}

export default Modal
