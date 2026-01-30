import { type ReactNode } from "react";

interface CenterContainerProps {
  children: ReactNode;
  className?: string;
}

const CenterContainer = ({ children, className } : CenterContainerProps) => {
    return (
      <div 
        className={`
          fixed inset-0 flex items-center justify-center px-4
          ${className ?? ""}
        `}
      >
        {children}
      </div>
    );
}

export default CenterContainer;
