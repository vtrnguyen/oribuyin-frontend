import { Product } from "./product.interface";

export interface CheckOutProduct extends Product {
    quantityToBuy: Number;
}
