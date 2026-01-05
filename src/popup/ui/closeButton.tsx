import type { ComponentPropsWithoutRef } from "react";

interface CloseButtonProps extends ComponentPropsWithoutRef<"p"> {
  className?: string,
}

const CloseButton = ({ className, ...props }: CloseButtonProps) => {
  return (
    <p 
        {...props}
        className={`absolute right-3 top-2 hover:cursor-pointer hover:font-bold ${className ?? ""}`}> 
        &#10005; 
    </p>
  );
};

export default CloseButton;
