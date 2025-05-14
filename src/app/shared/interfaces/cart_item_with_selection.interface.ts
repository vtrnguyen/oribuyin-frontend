import { CartItem } from "./cart_item.interface";

export interface CartItemWithSelection extends CartItem {
    isSelected: boolean;
}
