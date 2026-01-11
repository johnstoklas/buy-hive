export interface ItemType {
    image: string,
    item_id: string,
    name: string,
    notes: string,
    price: string,
    url: string,
}

export interface ScrapedItemType {
    name: string;
    price: string;
    url: string;
    image: string;
    notes: string;
    nameConfidence?: number;   // Optional confidence level (0-100%)
    priceConfidence?: number;  // Optional confidence level (0-100%)
    imageConfidence?: number;  // Optional confidence level (0-100%)
}