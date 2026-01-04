import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DropdownAction = {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
};

type DropdownMenuProps = {
  actions: DropdownAction[];
  hidden: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

export function DropdownMenu({
  actions,
  hidden = false,
  dropdownRef,
  className,
}: DropdownMenuProps) {
  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col absolute gap-1 py-1 right-0 my-1 mx-4 rounded-md 
        bg-[var(--secondary-background)] shadow-bottom
        ${hidden ? "hidden" : ""}
        ${className}
      `}
    >
      {actions.map(({ label, icon, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex flex-row items-center gap-2 px-2 py-1 hover:bg-[var(--secondary-background-hover)] hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={icon} />
          <p>{label}</p>
        </button>
      ))}
    </div>
  );
}
