import type { Dispatch, RefObject, SetStateAction } from "react";

type ItemNoteProps =
  | {
        isEditing: true;
        noteRef: RefObject<HTMLTextAreaElement | null> | null;
        setNoteValue: Dispatch<SetStateAction<string>>;
        handleBlur: () => void;
        onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
        noteValue: string;
        handleNoteSelect: () => void;
        placeholder?: string;
    }
  | {
        isEditing?: false;
        noteRef?: never;
        setNoteValue?: never;
        handleBlur?: never;
        onKeyDown?: never;
        noteValue: string;
        handleNoteSelect?: never;
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
            {(noteValue && noteValue.trim()) || "None"}
        </div>
    )
}

export default ItemNote;