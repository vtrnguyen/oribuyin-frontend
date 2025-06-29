import { Component, Input } from "@angular/core";
import { ORDER_STATUS } from "../../constants/order_status.constant";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-order-status-badge",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./order_status_badge.component.html",
    styleUrls: ["./order_status_badge.component.scss"],
})
export class OrderStatusBadgeComponent {
    @Input() status: string = "";

    get statusText(): string {
        switch (this.status) {
            case ORDER_STATUS.PENDING:
                return "Chờ xác nhận";
            case ORDER_STATUS.CONFIRMED:
                return "Đã xác nhận";
            case ORDER_STATUS.SHIPPED:
                return "Đang giao";
            case ORDER_STATUS.DELIVERED:
                return "Đã giao";
            case ORDER_STATUS.CANCELLED:
                return "Đã hủy";
            default:
                return this.status;
        }
    }

    get badgeClass(): string {
        switch (this.status) {
            case ORDER_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
            case ORDER_STATUS.CONFIRMED: return 'bg-blue-100 text-blue-800';
            case ORDER_STATUS.SHIPPED: return 'bg-purple-100 text-purple-800';
            case ORDER_STATUS.DELIVERED: return 'bg-green-100 text-green-800';
            case ORDER_STATUS.CANCELLED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}
