import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  className?: string,
  isDelete?: boolean,
  isModal?: boolean,
}

const Button = ({ className, isDelete, isModal, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`
        ${isDelete ? "bg-[var(--delete-color)]" : "bg-[var(--secondary-background)] hover:bg-[var(--accent-color)]"}
        ${isModal ? "rounded-md px-2 py-1" : "rounded-2xl px-4 py-2"}
        hover:cursor-pointer 
        ${className ?? ""}
      `}
    />
  );
};

export default Button;
