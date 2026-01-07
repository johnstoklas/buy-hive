interface ItemNoteStaticProps {
    noteValue: string;
    handleNoteSelect?: () => void;
}

const ItemNoteStatic = ({
    noteValue, 
    handleNoteSelect, 
}: ItemNoteStaticProps) => {
    return (
        <div 
            className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs"
            onDoubleClick={handleNoteSelect} 
        >
            {(noteValue && noteValue.trim()) || "None"}
        </div>
    )
}

export default ItemNoteStatic;