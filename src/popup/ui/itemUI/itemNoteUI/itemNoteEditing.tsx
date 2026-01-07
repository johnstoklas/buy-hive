import type { ChangeEventHandler, RefObject } from "react";

interface ItemNoteEditingProps {
    noteRef: RefObject<HTMLTextAreaElement | null> | null;
    setNoteValue: ChangeEventHandler<HTMLTextAreaElement>;
    handleBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    noteValue: string;
    placeholder?: string;
}

const ItemNoteEditing = ({
    noteRef, 
    setNoteValue, 
    handleBlur, 
    onKeyDown, 
    noteValue, 
    placeholder
}: ItemNoteEditingProps) => {
    return (
        <textarea
            className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs resize-none"
            placeholder={placeholder}
            ref={noteRef}
            value={noteValue}
            onChange={setNoteValue}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
        />              
    )
}

export default ItemNoteEditing;