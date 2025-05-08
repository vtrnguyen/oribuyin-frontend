import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

interface NavItem {
    label: string;
    key: string;
}

interface DropdownItem {
    label: string;
    key: string;
}

interface NotificationData {
    id: number;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

interface OrderData {
    id: number;
    orderNumber: string;
    orderDate: Date;
    totalAmount: number;
    status: string;
}

@Component({
    selector: "app-customer-profile",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class CustomerProfileComponent {
    currentUser = {
        avatar: "images/default_avatar.png",
        name: "Nguyễn Văn Tèo",
    };

    navItems: NavItem[] = [
        { label: "Thông báo", key: "notifications" },
        { label: "Tài khoản của tôi", key: "account" },
        { label: "Đơn mua", key: "orders" },
    ];

    accountDropdownItems: DropdownItem[] = [
        { label: "Hồ sơ", key: "profile" },
        { label: "Địa chỉ", key: "address" },
        { label: "Ngân hàng", key: "bank" },
        { label: "Đổi mật khẩu", key: "changePassword" },
    ];

    activeContent: string = "notifications";
    isAccountDropdownOpen: boolean = false;

    // Mock data cho Thông báo
    notifications: NotificationData[] = [
        { id: 1, message: "Đơn hàng #123 của bạn đã được giao.", createdAt: new Date(), isRead: false },
        { id: 2, message: "Chào mừng bạn đến với cửa hàng của chúng tôi!", createdAt: new Date(Date.now() - 86400000), isRead: true },
        { id: 3, message: "Có một sản phẩm mới đang được giảm giá.", createdAt: new Date(Date.now() - 172800000), isRead: false },
    ];

    // Mock data cho Đơn mua
    orders: OrderData[] = [
        { id: 1, orderNumber: "DH12345", orderDate: new Date(Date.now() - 259200000), totalAmount: 150000, status: "Đã giao" },
        { id: 2, orderNumber: "DH67890", orderDate: new Date(Date.now() - 604800000), totalAmount: 280000, status: "Đang giao" },
        { id: 3, orderNumber: "DH11223", orderDate: new Date(Date.now() - 1209600000), totalAmount: 95000, status: "Đã hoàn thành" },
    ];

    setActiveContent(key: string): void {
        this.activeContent = key;
        this.isAccountDropdownOpen = false;
    }

    toggleAccountDropdown(): void {
        this.isAccountDropdownOpen = !this.isAccountDropdownOpen;
    }
}
