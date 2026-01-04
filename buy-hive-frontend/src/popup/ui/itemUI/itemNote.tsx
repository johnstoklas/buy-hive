import type { Dispatch, RefObject, SetStateAction } from "react";

type ItemNoteProps =
  | {
        isEditing: true;
        noteRef: RefObject<HTMLTextAreaElement>;
        setNoteValue: Dispatch<SetStateAction<string>>;
        handleBlur;
        onKeyDown;
        noteValue: string;
        handleNoteSelect;
        placeholder?: string;
    }
  | {
        isEditing?: false;
        noteRef?: never;
        setNoteValue?: never;
        handleBlur?: never;
        onKeyDown?: never;
        noteValue: string;
        handleNoteSelect?;
        placeholder?: string;

    };

const ItemNote = ({
    isEditing, 
    noteRef, 
    setNoteValue, 
    handleBlur, 
    onKeyDown, 
    noteValue, 
    handleNoteSelect, 
    placeholder
}: ItemNoteProps) => {
    if (isEditing) {
        return (
            <textarea
                className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs resize-none"
                placeholder={placeholder}
                ref={noteRef}
                value={noteValue}
                onChange={(e) => {setNoteValue(e.target.value)}}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
            />              
        )
    }
    return (
        <div 
            className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs"
            onDoubleClick={handleNoteSelect} 
        >
            {noteValue.trim() || "None"}
        </div>
    )
}

export default ItemNote;