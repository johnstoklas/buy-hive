import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    className?: string,
}

const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-[var(--accent-color)] px-4 py-2 rounded-2xl hover:cursor-pointer ${className}`}
    />
  );
};

export default Button;
