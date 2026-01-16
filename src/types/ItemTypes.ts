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
    pageConfidence?: number;
    nameConfidence?: number;
    priceConfidence?: number;
    imageConfidence?: number;
    extractorType?: string;
}