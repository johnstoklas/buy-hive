import type { Dispatch, SetStateAction } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
};

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <input
      type="checbox"
      onClick={() => onChange(!checked)}
      className={`
        w-5 h-5 flex items-center justify-center
        rounded-md border
        transition-colors
        ${checked ? "bg-yellow-400 border-yellow-400" : "bg-white border-gray-300"}
      `}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && (
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}
