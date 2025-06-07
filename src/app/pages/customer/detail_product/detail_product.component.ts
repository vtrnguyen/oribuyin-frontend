import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../../shared/interfaces/product.interface";
import { Review } from "../../../shared/interfaces/review.interface";
import { ProductsService } from "../../../core/services/products.service";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { UsersService } from "../../../core/services/users.service";
import { CartService } from "../../../core/services/cart.service";
import { CartStateManagerService } from "../../../shared/services/cart_state_manager.service";

@Component({
    selector: "app-customer-detail-product",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./detail_product.component.html",
    styleUrls: ["./detail_product.component.scss"],
})
export class CustomerDetailProductComponent implements OnInit {
    productID: number = 0;
    product: Product | null = null;
    reviews: Review[] = [];
    quantityProduct: number = 1;

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private productsService: ProductsService,
        private usersService: UsersService,
        private cartService: CartService,
        private cartStateManagerService: CartStateManagerService
    ) { }

    ngOnInit(): void {
        this.loadDetailProduct();
    }

    private loadDetailProduct(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.productID = Number(params.get("id"));
            if (this.productID) {
                this.productsService.getProductByID(this.productID).subscribe({
                    next: (response: any) => {
                        if (response && response.code === 1 && response.data) {
                            this.product = {
                                id: response.data.product.id,
                                name: response.data.product.name,
                                description: response.data.product.description,
                                price: response.data.product.price,
                                discount: response.data.product.discount,
                                stockQuantity: response.data.product.stock_quantity,
                                image: response.data.product.image,
                                categoryID: response.data.product.category_id,
                            };

                            this.reviews = response.data.reviews.map((review: any) => ({
                                id: review.id,
                                userAvatar: review.user_avatar,
                                userFullName: review.user_full_name,
                                timestamp: review.timestamps,
                                rating: review.rating,
                                comment: review.comment,
                                userID: review.user_id,
                                productID: review.product_id,
                            }));

                        } else {
                            this.product = null;
                            this.reviews = [];
                        }
                    },
                    error: (error: any) => {
                        this.product = null;
                        this.reviews = [];
                    },
                });
            }
        });
    }

    calculateDiscountedPrice(): number {
        if (this.product && this.product.discount > 0) {
            return this.product.price * (1 - this.product.discount / 100);
        }
        return this.product ? this.product.price : 0;
    }

    decreaseQuantity(): void {
        if (this.quantityProduct > 1) {
            this.quantityProduct--;
        }
    }

    increaseQuantity(): void {
        if (this.product && (this.quantityProduct < this.product.stockQuantity)) {
            this.quantityProduct++;
        }
    }

    addToCart(): void {
        if (this.product && this.quantityProduct > 0) {
            const userID = this.usersService.getCurrentUserID();
            const productID = this.product.id;

            this.cartService.addProductToCart(userID, productID, this.quantityProduct).subscribe({
                next: (response: any) => {
                    if (response && response.code === 1) {
                        this.cartStateManagerService.updateCartItemQuantity$.next();
                        this.showNotification("success", "Thành công", `Đã thêm ${this.quantityProduct} sản phẩm ${this.product?.name} vào giỏ hàng thành công`);
                    }
                },
                error: (error: any) => {
                    this.showNotification("error", "Lỗi", `Thêm ${this.quantityProduct} sản phẩm ${this.product?.name} vào giỏ hàng không thành công`);
                },
            });

        }
    }

    buyNow(): void {
        if (this.product && this.quantityProduct > 0) {
            this.router.navigate(["/checkout"], { queryParams: { items: JSON.stringify([this.product.id]) } });
        }
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