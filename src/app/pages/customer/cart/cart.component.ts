import { Component, OnInit } from "@angular/core";
import { CartService } from "../../../core/services/cart.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { CartStateManagerService } from "../../../shared/services/cart_state_manager.service";
import { CartItemWithSelection } from "../../../shared/interfaces/cart_item_with_selection.interface";
import { Router } from "@angular/router";

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
    cartItems: CartItemWithSelection[] = [];
    selectAllChecked: boolean = false;

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(
        private router: Router,
        private cartService: CartService,
        private cartStateManagerService: CartStateManagerService
    ) { }

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
                            isSelected: false,
                            product: {
                                id: cartItem.product.id,
                                name: cartItem.product.name,
                                price: cartItem.product.price,
                                discount: cartItem.product.discount,
                                stockQuantity: cartItem.product.stock_quantity,
                                image: cartItem.product.image,
                            }
                        }));
                        this.updateSelectAllState();
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
                    this.cartStateManagerService.updateCartItemQuantity$.next();
                    this.showNotification("success", "Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
                    this.loadAllCartItems();
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng");
            },
        });
    }

    toggleSelectAll(): void {
        this.selectAllChecked = !this.selectAllChecked;
        this.cartItems.forEach(item => item.isSelected = this.selectAllChecked);
    }

    updateItemSelected(itemID: number, isSelected: boolean): void {
        const item = this.cartItems.find(item => item.id === itemID);
        if (item) {
            item.isSelected = isSelected;
        }
        this.updateSelectAllState();
    }

    private updateSelectAllState(): void {
        this.selectAllChecked = this.cartItems.every(item => item.isSelected);
    }

    checkoutSelectedItems(): void {
        const selectedItemIds = this.cartItems
            .filter(item => item.isSelected)
            .map(item => item.product.id);

        if (selectedItemIds.length > 0) {
            this.router.navigate(['/checkout'], { queryParams: { items: JSON.stringify(selectedItemIds) } });
        } else {
            this.showNotification("warning", "Chú ý", "Vui lòng chọn ít nhất một sản phẩm để mua.");
        }
    }

    calculateSelectedTotalPrice(): number {
        let total = 0;
        for (const item of this.cartItems.filter(item => item.isSelected)) {
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