import { forwardRef, type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children, className }, ref) => {
    return (
      <div 
        className={`
          flex flex-row px-2 py-2 gap-2 bg-[var(--secondary-background)] rounded-md
          ${className ?? ""}
        `}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Container;
