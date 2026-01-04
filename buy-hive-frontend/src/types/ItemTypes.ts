export interface ItemType {
    added_at: string,
    image: string,
    item_id: string,
    name: string,
    notes: string,
    price: string,
    selected_cart_ids: string[],
    url: string,
}

export interface ScrapedItemType {
    name: string;
    price: string;
    url: string;
    image: string;
    notes: string;
    selected_cart_ids: string[],
}