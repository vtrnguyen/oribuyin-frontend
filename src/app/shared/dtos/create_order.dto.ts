import { CreateOrderProductDto } from "./create_order_product.dto";

export type CreateOrderDto = {
    shipping_address: string;
    payment_method: string;
    products: CreateOrderProductDto[];
    voucher_discount: number;
    shipping_fee: number;
}
