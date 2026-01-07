import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CSSProperties } from "react";

type DropdownAction = {
    label: string;
    icon: IconDefinition;
    onClick: () => void;
};

type DropdownMenuProps = {
    actions: DropdownAction[];
    hidden: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownPosition: string;
    className?: string;
    style?: CSSProperties;
};

export function DropdownMenu({
    actions,
    hidden = false,
    dropdownRef,
    dropdownPosition,
    className,
    style,
}: DropdownMenuProps) {
    return (
        <div
            ref={dropdownRef}
            style={style}
            className={`flex flex-col w-fit z-50 mr-3 right-0 absolute gap-1 rounded-md bg-[var(--secondary-background)] shadow-bottom
                ${dropdownPosition === "above" ? "bottom-full mb-1" : "top-full mt-1"}
                ${hidden ? "hidden" : ""}
                ${className ?? ""}
            `}
        >
            {actions.map(({ label, icon, onClick }) => (
                <button
                    key={label}
                    onClick={onClick}
                    className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-[var(--secondary-background-hover)] hover:cursor-pointer"
                >
                    <FontAwesomeIcon icon={icon} />
                    <p>{label}</p>
                </button>
            ))}
        </div>
    );
}
