import { forwardRef, type ReactNode } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => {
    return (
      <div 
        className={`
          flex flex-row px-2 py-2 gap-2 bg-[var(--secondary-background)] rounded-md
          ${className ?? ""}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export default Container;
