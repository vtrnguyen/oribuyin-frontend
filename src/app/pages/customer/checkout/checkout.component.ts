import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { CheckOutProduct } from "../../../shared/interfaces/checkout_product.interface";
import { Notification } from "../../../shared/types/notification.type";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";

@Component({
    selector: "app-customer-checkout",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.scss"],
})
export class CustomerCheckoutComponent implements OnInit {
    selectedItemIds: number[] = [];
    checkoutProducts: CheckOutProduct[] = [];

    customerName: string = "";
    customerPhone: string = "";
    customerAddress: string = "";
    selectedOnlinePaymentMethod: string = "";

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

    placeOrder(): void {
        console.log("Họ và tên:", this.customerName);
        console.log("Số điện thoại:", this.customerPhone);
        console.log("Địa chỉ:", this.customerAddress);
        console.log("Phương thức thanh toán chính:", this.selectedPaymentMethod);
        console.log(
            "Phương thức thanh toán online (nếu có):",
            this.selectedOnlinePaymentMethod
        );

        if (!this.customerName || !this.customerPhone || !this.customerAddress) {
            this.showNotification(
                "warning",
                "Lỗi",
                "Vui lòng nhập đầy đủ thông tin nhận hàng."
            );
            return;
        }

        if (!this.selectedPaymentMethod) {
            this.showNotification(
                "warning",
                "Lỗi",
                "Vui lòng chọn phương thức thanh toán."
            );
            return;
        }

        if (
            this.selectedPaymentMethod === "online" &&
            !this.selectedOnlinePaymentMethod
        ) {
            this.showNotification(
                "warning",
                "Lỗi",
                "Vui lòng chọn hình thức thanh toán trực tuyến (PayPal/Visa)."
            );
            return;
        }

        const orderData = {
            customerInfo: {
                name: this.customerName,
                phone: this.customerPhone,
                address: this.customerAddress,
            },
            products: this.checkoutProducts.map((p) => ({
                product_id: p.id,
                quantity: p.quantityToBuy,
            })),
            total: this.calculateTotalPrice(),
            paymentMethod: this.selectedPaymentMethod,
            onlinePaymentMethod:
                this.selectedPaymentMethod === "online"
                    ? this.selectedOnlinePaymentMethod
                    : null,
        };

        if (this.selectedPaymentMethod === "online") {
            this.showNotification(
                "success",
                "Đặt hàng",
                `Chuyển đến cổng thanh toán trực tuyến (${this.selectedOnlinePaymentMethod}).`
            );
            console.log("Dữ liệu đặt hàng (Online):", orderData);
        } else if (this.selectedPaymentMethod === "cod") {
            this.showNotification(
                "success",
                "Đặt hàng",
                "Đặt hàng thành công, vui lòng chuẩn bị tiền mặt khi nhận hàng."
            );
            console.log("Dữ liệu đặt hàng (COD):", orderData);
        }
    }

    private loadCheckoutProducts(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params["items"]) {
                this.selectedItemIds = JSON.parse(params["items"]);
                this.productsService
                    .getCheckoutProducts(this.selectedItemIds)
                    .subscribe({
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
                            console.error("Lỗi khi tải danh sách sản phẩm muốn mua:", error);
                            this.showNotification(
                                "error",
                                "Lỗi",
                                "Lỗi khi tải danh sách sản phẩm muốn mua."
                            );
                        },
                    });
            }
        });
    }

    private showNotification(
        type: Notification,
        title: string,
        message: string
    ): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }
}