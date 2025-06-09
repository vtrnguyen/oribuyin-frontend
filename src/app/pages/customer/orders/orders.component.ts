import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../../core/services/order.service";
import { CommonModule } from "@angular/common";
import { UsersService } from "../../../core/services/users.service";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Router } from "@angular/router";
import { CreateReviewDto } from "../../../shared/dtos/create_review.dto";
import { ReviewsService } from "../../../core/services/review.service";
import { FormsModule } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "app-customer-orders",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./orders.component.html",
    styleUrls: ["./orders.component.scss"],
})
export class CustomerOrdersComponent implements OnInit {
    orders: any[] = [];
    orderTabs = [
        { label: "Tất cả", value: "all" },
        { label: "Chờ xác nhận", value: "pending" },
        { label: "Đã xác nhận", value: "confirmed" },
        { label: "Đang vận chuyển", value: "shipped" },
        { label: "Đã hoàn thành", value: "delivered" },
        { label: "Đã hủy", value: "cancelled" },
    ];
    selectedTab: string = "all";

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    showReviewModal: boolean = false;
    reviewProduct: any = null;
    reviewOrderId: number | null = null;
    reviewRating: number = 5;
    reviewComment: string = "";

    showTrackModal: boolean = false;
    trackMapUrl: any = "";
    userAddress: string = "";
    transportLat = 10.80025; // transport location Lat - latitude (vĩ độ) (40 Đường Số 3, Trường Thạnh, Thủ Đức, Hồ Chí Minh)
    transportLng = 106.85813; // transport location Lng - Logitude (kinh độ)
    userLat: number | null = null;
    userLng: number | null = null;
    distanceKm: number | null = null;

    get filteredOrders() {
        if (this.selectedTab === "all") return this.orders;
        return this.orders.filter(order => order.status === this.selectedTab);
    }

    constructor(
        private router: Router,
        private orderService: OrderService,
        private usersService: UsersService,
        private reviewsService: ReviewsService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.loadUsersOrder();
    }

    cancelOrder(orderId: number): void {
        this.updateOrderID(orderId, "cancelled");
    }

    trackOrder(orderId: number): void {
        const transportVehicleLocation = "40 Đường Số 3, Trường Thạnh, Thủ Đức, Hồ Chí Minh";
        const transportVehicleEncoded = encodeURIComponent(transportVehicleLocation);

        // transport vehicle location
        this.transportLat = 10.80025;
        this.transportLng = 106.85813;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: any) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    this.userLat = lat;
                    this.userLng = lng;
                    this.distanceKm = this.getDistanceFromLatLonInKm(this.transportLat, this.transportLng, lat, lng);

                    this.trackMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                        `https://www.google.com/maps?q=${transportVehicleEncoded}+to+${lat},${lng}&output=embed`
                    );
                    this.userAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    this.showTrackModal = true;
                    document.body.style.overflow = 'hidden';
                },
                (error: any) => {
                    this.distanceKm = null;
                    // if can not getting location, take it from order
                    const order = this.orders.find(o => o.id === orderId);
                    this.userAddress = order?.shipping_address || 'Không xác định';
                    const userEncoded = encodeURIComponent(this.userAddress);
                    this.trackMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                        `https://www.google.com/maps?q=${transportVehicleEncoded}+to+${userEncoded}&output=embed`
                    );
                    this.showTrackModal = true;
                    document.body.style.overflow = 'hidden';
                }
            );
        } else {
            this.distanceKm = null;
            // if browser does not support for geolocation
            const order = this.orders.find(o => o.id === orderId);
            this.userAddress = order?.shipping_address || 'Không xác định';
            const userEncoded = encodeURIComponent(this.userAddress);
            this.trackMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.google.com/maps?q=${transportVehicleEncoded}+to+${userEncoded}&output=embed`
            );
            this.showTrackModal = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeTrackModal(): void {
        this.showTrackModal = false;
        document.body.style.overflow = '';
    }

    reorder(order: any): void {
        const selectedItemIds = order.order_items.map((item: any) => item.product_id);

        if (selectedItemIds.length > 0) {
            this.router.navigate(['/checkout'], { queryParams: { items: JSON.stringify(selectedItemIds) } });
        } else {
            this.showNotification("warning", "Chú ý", "Không có sản phẩm nào để mua lại.");
        }
    }

    reviewOrder(order: any): void {
        if (order.order_items && order.order_items.length > 0) {
            this.reviewProduct = order.order_items[0].product;
            this.reviewOrderId = order.id;
            this.reviewRating = 5;
            this.reviewComment = "";
            this.showReviewModal = true;

            document.body.style.overflow = "hidden";
        }
    }

    setRating(star: number): void {
        this.reviewRating = star;
    }

    closeReviewModal(): void {
        this.showReviewModal = false;
        this.reviewProduct = null;
        this.reviewOrderId = null;
        this.reviewRating = 5;
        this.reviewComment = "";

        document.body.style.overflow = '';
    }

    submitReview(): void {
        if (!this.reviewProduct || !this.reviewOrderId) return;

        const review: CreateReviewDto = {
            product_id: this.reviewProduct.id,
            rating: this.reviewRating,
            comment: this.reviewComment,
        };

        this.reviewsService.createReview(review).subscribe({
            next: (response: any) => {
                this.showNotification("success", "Thành công", "Đánh giá của bạn đã được gửi!");
                this.closeReviewModal();
            },
            error: (response: any) => {
                this.showNotification("error", "Lỗi", "Gửi đánh giá không thành công!");
            },
        });
    }

    confirmedReceipt(order: number): void {
        this.updateOrderID(order, "delivered");
    }

    private loadUsersOrder(): void {
        const userId = this.usersService.getCurrentUserID();
        this.orderService.getOrdersByUserId(userId).subscribe((res: any) => {
            if (res && res.code === 1) {
                this.orders = res.data;
            }
        });
    }

    private updateOrderID(orderID: number, status: string): void {
        this.orderService.updateOrder(orderID, status).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    if (status === "cancelled") {
                        this.showNotification("success", "Thành công", "Đã hủy đơn hàng.");
                    } else if (status === "delivered") {
                        this.showNotification("success", "Thành công", "Bạn đã xác nhận hoàn thành đơn hàng.");
                    } else {
                        this.showNotification("success", "Thành công", "Cập nhật đơn hàng thành công.");
                    }

                    this.loadUsersOrder();
                }
            },
            error: (error: any) => {
                if (status === "cancelled") {
                    this.showNotification("error", "Lỗi", "Hủy đơn hàng không thành công.");
                } else if (status === "delivered") {
                    this.showNotification("error", "Lỗi", "Xác nhận hoàn thành đơn hàng không thành công.");
                } else {
                    this.showNotification("error", "Lỗi", "Xác nhận đơn hàng thành công.");
                }
            },
        })
    }

    // Haversine formula
    private getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // transfer degree to radian 1 degree = pi / 180 radian
    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
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