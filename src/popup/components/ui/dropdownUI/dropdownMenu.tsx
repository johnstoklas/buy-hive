import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

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
    anchorRef: React.RefObject<HTMLButtonElement | null>;
};

export function DropdownMenu({
    actions,
    hidden = false,
    dropdownRef,
    className,
    anchorRef,
}: DropdownMenuProps) {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    useLayoutEffect(() => {
        if (!anchorRef.current || hidden) return;

        const rect = anchorRef.current.getBoundingClientRect();

        const dropdownHeight = 100; 
        const spaceBelow = window.innerHeight - rect.bottom;

        const shouldRenderAbove = spaceBelow < dropdownHeight;

        const top = shouldRenderAbove
            ? rect.top - dropdownHeight + 10 + window.scrollY
            : rect.bottom + window.scrollY;

        const left = rect.right - 80 + window.scrollX;

        setPosition({ top, left });
    }, [anchorRef, hidden]);

    return createPortal(
        <div
            ref={dropdownRef}
            className={`flex flex-col w-fit z-50 mr-3 right-0 absolute gap-1 rounded-md bg-[var(--secondary-background)] shadow-bottom
                ${hidden ? "hidden" : ""}
                ${className ?? ""}
            `}
            style={{
                top: position?.top,
                left: position?.left,
            }}
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
        </div>,
        document.body
    );
}
