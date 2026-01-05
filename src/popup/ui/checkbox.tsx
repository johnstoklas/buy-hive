import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentPropsWithoutRef } from "react";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {}

const Checkbox = ({ className, checked, ...props }: CheckboxProps) => {
    return (
        <>
            <input
                type="checkbox"
                checked={checked}
                className="peer sr-only"
                {...props}
            />
            <span
                className={`
                    w-4 h-4 p-1 rounded-md flex items-center justify-center
                    ${checked ? "bg-[var(--accent-color)]" : "bg-white border border-[var(--secondary-background-hover)]"}
                    ${className ?? ""}
                `}
            >
                {checked && (
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="text-black text-[10px]"
                    />
                )}
            </span>
        </>
    );
};

export default Checkbox;
