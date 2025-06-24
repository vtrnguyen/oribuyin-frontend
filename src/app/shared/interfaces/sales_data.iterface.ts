
export interface SalesData {
    id: string;
    order_date: string;
    customer: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    };
    total_amount: number;
    status: string;
}
