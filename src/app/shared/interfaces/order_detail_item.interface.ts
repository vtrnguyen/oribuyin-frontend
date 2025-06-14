import { OrderDetailProduct } from "./order_detail_product.interface";

export interface OrderItemDetail {
    id: number;
    price_at_order_time: number;
    quantity: number;
    created_at: Date | string;
    updated_at: Date | string;
    order_id: number;
    product_id: number;
    product: OrderDetailProduct;
}
