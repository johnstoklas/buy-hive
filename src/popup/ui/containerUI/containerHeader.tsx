import { type ComponentPropsWithoutRef } from "react";

interface ContainerHeaderProps {
  titleText?: string;
  className?: string;
  closeButtonProps: ComponentPropsWithoutRef<"p">;
}

const ContainerHeader = ({ titleText, className, closeButtonProps } : ContainerHeaderProps ) => {
    return (
      <div className={`flex justify-between align-items ${className ?? ""}`}>
        {titleText && <p className="font-semibold">
          {titleText}
        </p>}
        <p 
          {...closeButtonProps}
          className="hover:cursor-pointer hover:font-bold" 
        >
          &#10005; 
        </p>
    </div>
    );
}

export default ContainerHeader;
