
export interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number,
        name: string,
        price: number,
        discount: number,
        stockQuantity: number,
        image: string,
    };
}
