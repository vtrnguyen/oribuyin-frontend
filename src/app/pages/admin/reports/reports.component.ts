import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrderService } from "../../../core/services/order.service";

@Component({
    selector: "app-admin-reports",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"],
})
export class AdminReportsComponent implements OnInit {
    selectedDateFilter: string = 'thisMonth';
    customStartDate: string | null = null;
    customEndDate: string | null = null;

    filteredSalesData: any[] = [];

    totalRevenue: number = 0;
    totalOrders: number = 0;
    totalItemsSold: number = 0;

    notificationVisible: boolean = false;
    notificationType: 'success' | 'error' | 'warning' = 'success';
    notificationTitle: string = '';
    notificationMessage: string = '';

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.applyDateFilter();
    }

    applyDateFilter(): void {
        let range = '';
        switch (this.selectedDateFilter) {
            case 'today': range = 'today'; break;
            case 'yesterday': range = 'yesterday'; break;
            case 'last7days': range = 'last_7_days'; break;
            case 'thisMonth': range = 'this_month'; break;
            case 'lastMonth': range = 'last_month'; break;
            case 'thisQuarter': range = 'this_quarter'; break;
            case 'custom': range = 'custom'; break;
            default: range = 'this_month';
        }

        let custom_start = undefined;
        let custom_end = undefined;
        if (range === 'custom') {
            if (!this.customStartDate || !this.customEndDate) {
                this.showNotification("error", "Lỗi", "Vui lòng chọn đủ ngày bắt đầu và kết thúc.");
                this.filteredSalesData = [];
                this.calculateReportSummary();
                return;
            }
            if (this.customStartDate > this.customEndDate) {
                this.showNotification("error", "Lỗi", "Ngày bắt đầu không được lớn hơn ngày kết thúc.");
                this.filteredSalesData = [];
                this.calculateReportSummary();
                return;
            }
            custom_start = this.customStartDate;
            custom_end = this.customEndDate;
        }

        this.orderService.getOrdersByTimeRange(range, custom_start, custom_end).subscribe({
            next: (res: any) => {
                if (res && res.code === 1) {
                    this.filteredSalesData = res.data.map((order: any) => ({
                        orderId: order.id,
                        orderDate: order.order_date,
                        customerName: order.customer?.first_name + ' ' + order.customer?.last_name,
                        totalAmount: order.total_amount,
                        status: this.mapStatus(order.status)
                    }));
                } else {
                    this.filteredSalesData = [];
                }
                this.calculateReportSummary();
            },
            error: () => {
                this.filteredSalesData = [];
                this.calculateReportSummary();
                this.showNotification("error", "Lỗi", "Không thể lấy dữ liệu đơn hàng từ server.");
            }
        });
    }

    private mapStatus(status: string): string {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    }

    private calculateReportSummary(): void {
        this.totalRevenue = 0;
        this.totalOrders = 0;
        this.totalItemsSold = 0;

        this.filteredSalesData.forEach(order => {
            if (order.status === 'Hoàn thành') {
                this.totalRevenue += order.totalAmount;
                this.totalOrders++;
                this.totalItemsSold += 1;
            }
        });
    }

    resetFilters(): void {
        this.selectedDateFilter = 'thisMonth';
        this.customStartDate = null;
        this.customEndDate = null;
        this.applyDateFilter();
    }

    private showNotification(type: 'success' | 'error' | 'warning', title: string, message: string): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }
}