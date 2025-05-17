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

    shippingFee: number = 0;
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
        return 0;
    }

    calculateSubtotal(): number {
        return 0;
    }

    calculateTotalPrice(): number {
        return 0;
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
                                quantityToBuy: product.quantity_to_buy,
                            }));
                        }
                    },
                    error: (error: any) => {

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
