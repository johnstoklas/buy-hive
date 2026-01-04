import { type ReactNode } from "react";

interface FixedContainerProps {
  children: ReactNode;
  className?: string;
}

const FixedContainer = ({ children, className } : FixedContainerProps) => {
    return (
      <div 
        className={`
          fixed bottom-14 left-0 right-0 px-4 my-3
          ${className ?? ""}
        `}
      >
        {children}
      </div>
    );
}

export default FixedContainer;
