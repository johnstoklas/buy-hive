import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";

interface ImageProps {
    item: ItemType | ScrapedItemType
}

const ItemImage = ({ item } : ImageProps) => {
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

export default ItemImage;