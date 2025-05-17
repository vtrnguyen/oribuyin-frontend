import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { CheckOutProduct } from "../../../shared/interfaces/checkout_product.interface";
import { Notification } from "../../../shared/types/notification.type";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-customer-checkout",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.scss"],
})
export class CustomerCheckoutComponent implements OnInit {
    selectedItemIds: number[] = [];
    checkoutProducts: CheckOutProduct[] = [];

    shippingFee: number = 30000;
    discountAmount: number = 0;
    selectedPaymentMethod: string = "";

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadCheckoutProducts();
    }

    calculateProductTotal(product: CheckOutProduct): number {
        const priceAfterDiscount = product.price * (1 - product.discount / 100);
        return priceAfterDiscount * product.quantityToBuy;
    }

    calculateSubtotal(): number {
        return this.checkoutProducts.reduce((sum, product) => {
            return sum + this.calculateProductTotal(product);
        }, 0);
    }

    calculateTotalPrice(): number {
        const subtotal = this.calculateSubtotal();
        return subtotal + this.shippingFee - this.discountAmount;
    }

    private loadCheckoutProducts(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params["items"]) {
                this.selectedItemIds = JSON.parse(params["items"]);
                this.productsService.getCheckoutProducts(this.selectedItemIds).subscribe({
                    next: (response: any) => {
                        if (response && response.code === 1) {
                            this.checkoutProducts = response.data.map((product: any) => ({
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                price: Number(product.price),
                                discount: Number(product.discount),
                                stockQuantity: product.stock_quantity,
                                image: product.image,
                                categoryID: product.category_id,
                                quantityToBuy: product.quantity_to_buy || 1,
                            }));
                        }
                    },
                    error: (error: any) => {
                        this.showNotification("error", "Lỗi", "Lỗi khi tải danh sách sản phẩm muốn mua")
                    },
                });
            }
        });
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
