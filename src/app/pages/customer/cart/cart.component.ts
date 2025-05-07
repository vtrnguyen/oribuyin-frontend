import { Component, OnInit } from "@angular/core";
import { CartItem } from "../../../shared/interfaces/cart_item.interface";
import { CartService } from "../../../core/services/cart.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";

@Component({
    selector: "app-customer-cart",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./cart.component.html",
    styleUrls: ["./cart.component.scss"],
})
export class CustomerCartComponent implements OnInit {
    cartItems: CartItem[] = [];

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

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

    decreaseQuantity(index: number): void {
        if (this.cartItems[index].quantity > 1) {
            this.cartItems[index].quantity--;
            this.updateCartItemQuantity(this.cartItems[index].id, this.cartItems[index].quantity);
        }
    }

    increaseQuantity(index: number): void {
        if (this.cartItems[index].quantity < this.cartItems[index].product.stockQuantity) {
            this.cartItems[index].quantity++;
            this.updateCartItemQuantity(this.cartItems[index].id, this.cartItems[index].quantity);
        }
    }

    updateQuantityInput(index: number, event: any): void {
        const newQuantity = Number(event.target.value);

        if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= this.cartItems[index].product.stockQuantity) {
            this.cartItems[index].quantity = newQuantity;
            this.updateCartItemQuantity(this.cartItems[index].id, this.cartItems[index].quantity);
        } else {
            event.target.value = this.cartItems[index].quantity;
        }
    }

    updateCartItemQuantity(cartItemID: number, quantity: number): void {
        this.cartService.updateCartItemQuantity(cartItemID, quantity).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    return;
                }
            },
            error: (error: any) => {
                return;
            },
        });
    }

    removeCartItem(cartItemID: number): void {
        this.cartService.deleteCartItem(cartItemID).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.showNotification("success", "Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
                    this.loadAllCartItems();
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
            },
        });
    }

    calculateTotalPrice(): number {
        let total = 0;
        for (const item of this.cartItems) {
            const discountedPrice = item.product.price * (1 - (item.product.discount / 100));
            total += discountedPrice * item.quantity;
        }
        return total;
    }

    private showNotification(type: Notification, title: string, message: string): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }
}