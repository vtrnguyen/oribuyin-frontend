import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { OrderService } from "../../../core/services/order.service";
import { DetailOrder } from "../../../shared/interfaces/detail_order.interface";
import { ClickOutsideModule } from "ng-click-outside";
import * as XLSX from "xlsx";
import { OrderStatusBadgeComponent } from "../../../shared/components/order_status_badge/order_status_badge.component";

@Component({
    selector: "app-staff-orders",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DatePipe,
        NotificationComponent,
        ClickOutsideModule,
        OrderStatusBadgeComponent,
    ],
    templateUrl: "./orders.component.html",
    styleUrls: ["./orders.component.scss"],
})
export class StaffOrdersComponent implements OnInit {
    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    orders: DetailOrder[] = [];
    filteredOrders: DetailOrder[] = [];
    totalOrders: number = 0;

    searchQuery: string = '';
    filterStartDate: string = '';
    filterEndDate: string = '';
    filterStatus: '' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = '';

    isActionsMenuOpen: boolean = false;
    selectedOrder: DetailOrder | null = null;
    isViewOrderModalOpen: boolean = false;
    isActionConfirmModalOpen: boolean = false;
    currentActionMenuOrder: DetailOrder | null = null;

    actionModalTitle: string = '';
    actionModalMessage: string = '';
    actionModalConfirmText: string = '';
    currentAction: 'confirm' | 'ship' | 'complete' | 'cancel' | null = null;

    constructor(
        private ordersService: OrderService,
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    private loadOrders(): void {
        this.ordersService.getAllOrders().subscribe({
            next: (response: any) => {
                if (response.code === 1 && response.data) {
                    this.orders = response.data.map((order: any) => ({
                        ...order,
                        order_date: new Date(order.order_date),
                        created_at: new Date(order.created_at),
                        updated_at: new Date(order.updated_at),
                        customer: order.customer || {},
                        order_items: order.order_items ? order.order_items.map((item: any) => ({
                            ...item,
                            product: item.product || {}
                        })) : [],
                        shipping_address: order.shipping_address || '',
                        total_amount: order.total_amount || 0,
                        payment_method: order.payment_method || '',
                        payment_status: order.payment_status || ''
                    })) as DetailOrder[];
                    this.filterOrders();
                } else {
                    this.orders = [];
                    this.filterOrders();
                }
            },
            error: (error: any) => {
                console.error('Error fetching orders:', error);
                this.showNotification('error', 'Lỗi!', 'Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
                this.orders = [];
                this.filterOrders();
            }
        });
    }

    filterOrders(): void {
        let tempOrders = [...this.orders];

        if (this.searchQuery) {
            const lowerCaseQuery = this.searchQuery.toLowerCase();
            tempOrders = tempOrders.filter(order =>
                order.id.toString().includes(lowerCaseQuery) ||
                (order.customer && `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.toLowerCase().includes(lowerCaseQuery))
            );
        }

        if (this.filterStartDate && this.filterEndDate) {
            const startDate = new Date(this.filterStartDate);
            const endDate = new Date(this.filterEndDate);
            endDate.setHours(23, 59, 59, 999);

            tempOrders = tempOrders.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate >= startDate && orderDate <= endDate;
            });
        } else if (this.filterStartDate) {
            const startDate = new Date(this.filterStartDate);
            tempOrders = tempOrders.filter(order => new Date(order.order_date) >= startDate);
        } else if (this.filterEndDate) {
            const endDate = new Date(this.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            tempOrders = tempOrders.filter(order => new Date(order.order_date) <= endDate);
        }

        if (this.filterStatus) {
            tempOrders = tempOrders.filter(order => order.status === this.filterStatus);
        }

        this.filteredOrders = tempOrders;
        this.totalOrders = this.filteredOrders.length;
    }

    clearFilters(): void {
        this.searchQuery = '';
        this.filterStartDate = '';
        this.filterEndDate = '';
        this.filterStatus = '';
        this.filterOrders();
    }

    getStatusDisplayName(status: DetailOrder['status'] | undefined): string {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'shipped': return 'Đang vận chuyển';
            case 'delivered': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    }

    toggleActionsMenu(order: DetailOrder, buttonElement: HTMLButtonElement): void {
        if (this.currentActionMenuOrder === order) {
            this.closeActionMenu();
        } else {
            this.closeActionMenu();
            this.currentActionMenuOrder = order;
            this.isActionsMenuOpen = true;
        }
    }

    closeActionMenu(): void {
        this.isActionsMenuOpen = false;
        this.currentActionMenuOrder = null;
    }

    openViewOrderModal(order: DetailOrder): void {
        this.selectedOrder = order;
        this.isViewOrderModalOpen = true;
        this.closeActionMenu();
    }

    closeViewOrderModal(): void {
        this.isViewOrderModalOpen = false;
        this.selectedOrder = null;
    }

    openActionConfirmModal(action: 'confirm' | 'ship' | 'complete' | 'cancel', order: DetailOrder): void {
        this.selectedOrder = order;
        this.currentAction = action;

        switch (action) {
            case 'confirm':
                this.actionModalTitle = 'Xác nhận đơn hàng';
                this.actionModalMessage = `Bạn có muốn xác nhận đơn hàng #${order.id} không? Đơn hàng sẽ chuyển sang trạng thái "Đã xác nhận".`;
                this.actionModalConfirmText = 'Xác nhận';
                break;
            case 'ship':
                this.actionModalTitle = 'Giao hàng';
                this.actionModalMessage = `Bạn có muốn chuyển trạng thái đơn hàng #${order.id} sang "Đang vận chuyển" không?`;
                this.actionModalConfirmText = 'Giao hàng';
                break;
            case 'complete':
                this.actionModalTitle = 'Hoàn thành đơn hàng';
                this.actionModalMessage = `Bạn có muốn đánh dấu đơn hàng #${order.id} là "Đã hoàn thành" không?`;
                this.actionModalConfirmText = 'Hoàn thành';
                break;
            case 'cancel':
                this.actionModalTitle = 'Hủy đơn hàng';
                this.actionModalMessage = `Bạn có chắc chắn muốn hủy đơn hàng #${order.id} không? Hành động này không thể hoàn tác.`;
                this.actionModalConfirmText = 'Xác nhận hủy';
                break;
        }

        this.isActionConfirmModalOpen = true;
        this.closeActionMenu();
    }

    closeActionConfirmModal(): void {
        this.isActionConfirmModalOpen = false;
        this.selectedOrder = null;
        this.currentAction = null;
    }

    performAction(): void {
        if (!this.selectedOrder || !this.currentAction) return;

        let newStatus: DetailOrder['status'] | null = null;
        let successMessage = '';
        let errorMessage = '';

        switch (this.currentAction) {
            case 'confirm':
                if (this.selectedOrder.status === 'pending') {
                    newStatus = 'confirmed';
                    successMessage = `Đơn hàng #${this.selectedOrder.id} đã được xác nhận thành công.`;
                } else {
                    errorMessage = `Không thể xác nhận đơn hàng #${this.selectedOrder.id} vì trạng thái không hợp lệ.`;
                }
                break;
            case 'ship':
                if (this.selectedOrder.status === 'confirmed') {
                    newStatus = 'shipped';
                    successMessage = `Đơn hàng #${this.selectedOrder.id} đã được chuyển sang trạng thái "Đang vận chuyển".`;
                } else {
                    errorMessage = `Không thể giao hàng đơn hàng #${this.selectedOrder.id} vì trạng thái không hợp lệ.`;
                }
                break;
            case 'complete':
                if (this.selectedOrder.status === 'shipped') {
                    newStatus = 'delivered';
                    successMessage = `Đơn hàng #${this.selectedOrder.id} đã được đánh dấu là "Đã hoàn thành".`;
                } else {
                    errorMessage = `Không thể hoàn thành đơn hàng #${this.selectedOrder.id} vì trạng thái không hợp lệ.`;
                }
                break;
            case 'cancel':
                if (this.selectedOrder.status === 'pending' || this.selectedOrder.status === 'confirmed') {
                    newStatus = 'cancelled';
                    successMessage = `Đơn hàng #${this.selectedOrder.id} đã bị hủy thành công.`;
                } else {
                    errorMessage = `Không thể hủy đơn hàng #${this.selectedOrder.id} vì trạng thái không hợp lệ.`;
                }
                break;
        }

        if (newStatus && this.selectedOrder.id) {
            this.ordersService.updateOrder(this.selectedOrder.id, newStatus).subscribe({
                next: (response: any) => {
                    if (response.code === 1) {
                        this.showNotification('success', 'Thành công!', successMessage);
                        this.loadOrders();
                    } else {
                        this.showNotification('error', 'Lỗi!', response.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
                    }
                },
                error: (error: any) => {
                    console.error('Error updating order status:', error);
                    this.showNotification('error', 'Lỗi!', `Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
                },
                complete: () => {
                    this.closeActionConfirmModal();
                }
            });
        } else {
            this.showNotification('error', 'Lỗi!', errorMessage || 'Hành động không hợp lệ hoặc trạng thái đơn hàng không cho phép.');
            this.closeActionConfirmModal();
        }
    }

    confirmOrder(order: DetailOrder): void { this.openActionConfirmModal('confirm', order); }
    shipOrder(order: DetailOrder): void { this.openActionConfirmModal('ship', order); }
    completeOrder(order: DetailOrder): void { this.openActionConfirmModal('complete', order); }
    cancelOrder(order: DetailOrder): void { this.openActionConfirmModal('cancel', order); }

    downloadOrderInfo(): void {
        this.showNotification('info', 'Đang tải xuống', 'Thông tin đơn hàng đang được chuẩn bị để tải xuống...');

        if (this.orders.length === 0) {
            this.showNotification('warning', 'Chú ý', 'Không có đơn hàng nào để tải xuống.');
            return;
        }

        const data = this.orders.map(order => ({
            "Mã đơn hàng": order.id,
            "Ngày đặt": new Date(order.order_date).toLocaleDateString('vi-VN'),
            "Trạng thái": this.mapOrderStatusToVietnamese(order.status),
            "Tổng tiền": order.total_amount,
            "Phương thức thanh toán": order.payment_method,
            "Trạng thái thanh toán": order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
            "Địa chỉ giao hàng": order.shipping_address,
            "ID Khách hàng": order.customer?.id,
            "Tên khách hàng": `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
            "Email khách hàng": order.customer?.email,
            "Số điện thoại khách hàng": order.customer?.phone_number,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "OriBuyin's Orders");

        XLSX.writeFile(wb, "danh_sach_don_hang_oribuyin.xlsx");

        this.showNotification('success', 'Hoàn tất', 'Thông tin đơn hàng đã được tải xuống.');
    }

    private mapOrderStatusToVietnamese(status: string): string {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'shipped': return 'Đang vận chuyển';
            case 'delivered': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
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
