import type { Dispatch, RefObject, SetStateAction } from "react";
import { useLocked } from "../../../context/LockedContext/useLocked";

interface DropdownButtonProps {
    dropdownVisible: boolean;
    setDropdownVisible: Dispatch<SetStateAction<boolean>>;
    buttonRef: RefObject<HTMLButtonElement | null>;
}

const DropdownButton = ({
    dropdownVisible,
    setDropdownVisible,
    buttonRef
} : DropdownButtonProps) => {
    const { isLocked } = useLocked();
    return (
        <button 
            className={`
                text-base z-40 w-6 h-6 rounded-full hover:cursor-pointer hover:bg-[var(--secondary-background-hover)] shrink-0
                ${isLocked ? "disabled-hover-modify" : ""}`
            } 
            onClick={() => setDropdownVisible(!dropdownVisible)}
            ref={buttonRef}
        >
            &#8942;
        </button>
    )
}

export default DropdownButton;