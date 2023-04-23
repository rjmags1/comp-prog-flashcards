import { ModalProps } from "../../types"

function Modal({ children, whiteText, width, height }: ModalProps) {
    const style: React.CSSProperties = {
        color: whiteText ? "white" : "",
        width: width ? `${width}px` : "500px",
        height: height ? `${height}px` : "300px",
        marginLeft: width ? `${-(width / 2)}px` : "-250px",
        marginTop: height ? `${-(height / 2)}px` : "-150px",
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
