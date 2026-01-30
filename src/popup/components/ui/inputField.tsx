import { onEnter } from "@/utils/keyboard";
import type { Dispatch, SetStateAction } from "react";

interface InputFieldProps {
    placeholder: string;
    value: string,
    setValue: Dispatch<SetStateAction<string>>;
    onSubmit: (val: string) => void;
    className?: string;
}

const InputField = ({
    placeholder,
    value,
    setValue,
    onSubmit,
    className,
} : InputFieldProps) => {
    return (
        <input 
            type="text" 
            className={`${className ?? ""}`}
            placeholder={placeholder} 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => onEnter(e, () => onSubmit(value))}
        />
    )
}

export default InputField;