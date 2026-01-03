import type { ItemType } from "@/types/ItemType";

interface ImageProps {
    item: ItemType
}

const Image = ({ item } : ImageProps) => {
    return (
        <div className="w-20 h-20 rounded-md">
        <img 
            src={item.image} 
            alt="" 
            className="w-full h-full object-cover rounded-md"
        />
        </div>
  );
};

export default Image;