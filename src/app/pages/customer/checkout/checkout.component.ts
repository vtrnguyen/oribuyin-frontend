import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { CheckOutProduct } from "../../../shared/interfaces/checkout_product.interface";
import { Notification } from "../../../shared/types/notification.type";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { OrderService } from "../../../core/services/order.service";
import { CartStateManagerService } from "../../../shared/services/cart_state_manager.service";
import { UsersService } from "../../../core/services/users.service";

@Component({
    selector: "app-customer-checkout",
    standalone: true,
    imports: [CommonModule, FormsModule, NotificationComponent],
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.scss"],
})
export class CustomerCheckoutComponent implements OnInit {
    selectedItemIds: number[] = [];
    checkoutProducts: CheckOutProduct[] = [];

    customerName: string = "";
    customerPhone: string = "";
    customerAddress: string = "";

    shippingFee: number = 30000;
    discountAmount: number = 0;
    selectedPaymentMethod: string = "";

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    vietQRUrl: string = "";
    showQRModal: boolean = false;
    pendingOrderData: any = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private productsService: ProductsService,
        private orderService: OrderService,
        private usersService: UsersService,
        private router: Router,
        private cartStateManagerService: CartStateManagerService
    ) { }

    ngOnInit(): void {
        this.loadCheckoutProducts();
        this.loadUserInfo();
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

        const orderData = {
            shipping_address: this.customerAddress,
            payment_method: this.selectedPaymentMethod,
            products: this.checkoutProducts.map((p) => ({
                product_id: p.id,
                quantity: p.quantityToBuy,
            })),
            voucher_discount: this.discountAmount,
            shipping_fee: this.shippingFee,
        };

        if (this.selectedPaymentMethod === "cod") {
            this.orderService.createOrder(orderData).subscribe({
                next: (response) => {
                    this.cartStateManagerService.updateCartItemQuantity$.next();
                    this.resetCheckoutInfo();
                    this.showNotification(
                        "success",
                        "Đặt hàng",
                        "Đặt hàng thành công, vui lòng chuẩn bị tiền mặt khi nhận hàng.",
                    );
                    setTimeout(() => {
                        this.router.navigate(['/orders']);
                    }, 1200);
                },
                error: (error) => {
                    this.showNotification(
                        "error",
                        "Lỗi",
                        "Đặt hàng thất bại. Vui lòng thử lại."
                    );
                },
            })
        } else if (this.selectedPaymentMethod === "online") {
            this.getVietQR(orderData);
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

    private loadUserInfo(): void {
        const userID = this.usersService.getCurrentUserID();

        if (userID) {
            this.usersService.getUserByID(userID).subscribe({
                next: (response: any) => {
                    if (response && response.code === 1) {
                        this.customerName = `${response.data[0].first_name} ${response.data[0].last_name}`;
                        this.customerAddress = response.data[0].address;
                        this.customerPhone = response.data[0].phone_number;
                    }
                },
                error: (error: any) => {
                    this.customerName = "";
                    this.customerAddress = "";
                    this.customerPhone = "";
                },
            });
        }
    }

    getVietQR(orderData: any): void {
        const BANK_ID = "MB";
        const ACCOUNT_NO = "0337917367";
        const ACCOUNT_NAME = "VO TRUNG NGUYEN";
        const TEMPLATE = "compact2";

        const AMOUNT = this.calculateTotalPrice();
        const DESCRIPTION = encodeURIComponent(`THANH TOAN DON HANG`);

        this.vietQRUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
        this.showQRModal = true;
        this.pendingOrderData = orderData;
    }

    confirmOnlinePayment(): void {
        if (!this.pendingOrderData) return;

        this.orderService.createOrder(this.pendingOrderData).subscribe({
            next: (response) => {
                this.cartStateManagerService.updateCartItemQuantity$.next();
                this.resetCheckoutInfo();
                this.showQRModal = false;
                this.showNotification(
                    "success",
                    "Đặt hàng",
                    "Đặt hàng thành công! Cảm ơn bạn đã thanh toán online."
                );
                setTimeout(() => {
                    this.router.navigate(["/orders"]);
                }, 1200);
            },
            error: (error) => {
                this.showNotification(
                    "error",
                    "Lỗi",
                    "Không thể tạo đơn hàng. Vui lòng thử lại."
                );
            },
        });
    }

    private resetCheckoutInfo(): void {
        this.customerName = "";
        this.customerPhone = "";
        this.customerAddress = "";
        this.selectedPaymentMethod = "";
        this.checkoutProducts = [];
        this.selectedItemIds = [];
        this.discountAmount = 0;
        this.shippingFee = 30000;
        this.vietQRUrl = "";
        this.pendingOrderData = null;
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