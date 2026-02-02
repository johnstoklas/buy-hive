import Checkbox from "./checkbox";

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem = ({ label, checked, onChange }: CheckboxItemProps) => {
    return (
        <label className="flex items-center gap-1 rounded-md p-1 hover:cursor-pointer hover:bg-[#f0f0f0]">
            <Checkbox checked={checked} onChange={onChange} />
            <span>{label}</span>
        </label>
    );
};

export default CheckboxItem;
