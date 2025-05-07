import { Component, OnInit } from "@angular/core";
import { CartItem } from "../../../shared/interfaces/cart_item.interface";
import { CartService } from "../../../core/services/cart.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-customer-cart",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.scss"],
})
export class CustomerCartComponent implements OnInit {
    cartItems: CartItem[] = [];

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.loadAllCartItems();
    }

    private loadAllCartItems(): void {
        const userID = Number(localStorage.getItem("user_id"));

        if (userID) {
            this.cartService.getCartItem(userID).subscribe({
                next: (response: any) => {
                    if (response && response.code === 1) {
                        this.cartItems = response.data.items.map((cartItem: any) => ({
                            id: cartItem.cart_item_id,
                            quantity: cartItem.quantity,
                            product: {
                                id: cartItem.product.id,
                                name: cartItem.product.name,
                                price: cartItem.product.price,
                                discount: cartItem.product.discount,
                                stockQuantity: cartItem.product.stock_quantity,
                                image: cartItem.product.image,
                            }
                        }));
                    }
                },
                error: (error: any) => {
                    console.log(">>> check error:", error);
                },
            });
        }
    }

    calculateTotalPrice(): number {
        let total = 0;
        for (const item of this.cartItems) {
            const discountedPrice = item.product.price * (1 - (item.product.discount / 100));
            total += discountedPrice * item.quantity;
        }
        return total;
    }
}