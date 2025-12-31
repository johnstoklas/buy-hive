import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    className?: string,
}

const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-[var(--secondary-background)] px-4 py-2 rounded-2xl hover:cursor-pointer hover:bg-[var(--accent-color)] ${className}`}
    />
  );
};

export default Button;
