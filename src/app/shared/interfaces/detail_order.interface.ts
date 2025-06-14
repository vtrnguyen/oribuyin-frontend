import { OrderItemDetail } from "./order_detail_item.interface";

export interface DetailOrder {
    id: number;
    order_date: Date | string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    shipping_address: string;
    payment_method: 'cod' | 'online';
    payment_status: 'unpaid' | 'paid' | 'failed';
    created_at: Date | string;
    updated_at: Date | string;
    user_id: number;
    customer: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    };
    order_items: OrderItemDetail[];
}
