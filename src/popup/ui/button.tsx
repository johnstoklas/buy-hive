import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    className?: string,
    isDelete?: boolean,
    isModal?: boolean,
    isAccent?: boolean,
}

const Button = ({ className, isDelete, isModal, isAccent, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            className={`
                hover:cursor-pointer bg-[var(--secondary-background)] hover:bg-[var(--accent-color)]
                ${isDelete ? "!bg-[var(--delete-color)] !hover:bg-[var(--delete-color)]" : ""}
                ${isModal ? "border border-[var(--secondary-background-hover)] rounded-md px-3 py-1 hover:border-[var(--accent-color)] " : "rounded-2xl px-4 py-2"}
                ${isAccent ? "!bg-[var(--accent-color)]" : ""}
                ${className ?? ""}
            `}
        />
    );
};

export default Button;
