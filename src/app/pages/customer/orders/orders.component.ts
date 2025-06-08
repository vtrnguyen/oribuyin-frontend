import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../../core/services/order.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-customer-orders",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./orders.component.html",
    styleUrls: ["./orders.component.scss"],
})
export class CustomerOrdersComponent implements OnInit {
    orders: any[] = [];
    orderTabs = [
        { label: "Tất cả", value: "all" },
        { label: "Chờ xác nhận", value: "pending" },
        { label: "Đang vận chuyển", value: "shipping" },
        { label: "Đã hoàn thành", value: "completed" },
        { label: "Đã hủy", value: "cancelled" },
    ];
    selectedTab: string = "all";

    get filteredOrders() {
        if (this.selectedTab === "all") return this.orders;
        return this.orders.filter(order => order.status === this.selectedTab);
    }

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        const userId = Number(localStorage.getItem("user_id"));
        this.orderService.getOrdersByUserId(userId).subscribe((res: any) => {
            if (res && res.code === 1) {
                this.orders = res.data;
            }
        });
    }

    cancelOrder(orderId: number) {
        // Gọi API hủy đơn
    }

    trackOrder(orderId: number) {
        // Chuyển sang trang theo dõi đơn hoặc mở modal
    }

    reorder(order: any) {
        // Thêm lại sản phẩm vào giỏ hàng
    }

    reviewOrder(order: any) {
        // Mở modal đánh giá
    }
}