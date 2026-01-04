import { type ReactNode } from "react";

interface ContainerHeaderProps {
  children: ReactNode;
  className?: string;
}

const ContainerHeader = ({ children, className } : ContainerHeaderProps ) => {
    return (
      <p 
        className={`
          flex flex-1
          ${className ?? ""}
        `}
      >
        {children}
      </p>
    );
}

export default ContainerHeader;
