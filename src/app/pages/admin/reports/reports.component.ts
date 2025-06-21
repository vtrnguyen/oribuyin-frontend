import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common"; // Import CommonModule for ngIf, ngFor, date pipe, number pipe
import { FormsModule } from "@angular/forms"; // Import FormsModule for ngModel

// Định nghĩa interface cho dữ liệu bán hàng
interface SalesData {
    orderId: string;
    orderDate: Date;
    customerName: string;
    totalAmount: number;
    status: 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy';
}

@Component({
    selector: "app-admin-reports",
    standalone: true,
    imports: [
        CommonModule, // Đảm bảo đã import
        FormsModule // Đảm bảo đã import
    ],
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"],
})
export class AdminReportsComponent implements OnInit {
    // Biến cho các tùy chọn lọc
    selectedDateFilter: string = 'thisMonth'; // Mặc định là 'Tháng này'
    customStartDate: string | null = null;
    customEndDate: string | null = null;

    // Biến để lưu trữ dữ liệu báo cáo
    allSalesData: SalesData[] = [];
    filteredSalesData: SalesData[] = [];

    // Biến tổng quan
    totalRevenue: number = 0;
    totalOrders: number = 0;
    totalItemsSold: number = 0; // Đây sẽ là tổng số lượng sản phẩm trong các đơn hàng

    ngOnInit(): void {
        this.generateMockSalesData(); // Tạo dữ liệu giả khi component khởi tạo
        this.applyDateFilter(); // Áp dụng bộ lọc ban đầu (Tháng này)
    }

    // --- Mock Data Generation ---
    private generateMockSalesData(): void {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const last7DaysStart = new Date(today);
        last7DaysStart.setDate(today.getDate() - 7);

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

        const thisQuarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);

        this.allSalesData = [
            // Today's data
            { orderId: 'ORD001', orderDate: new Date(today.setHours(10, 0, 0)), customerName: 'Nguyễn Văn A', totalAmount: 150000, status: 'Hoàn thành' },
            { orderId: 'ORD002', orderDate: new Date(today.setHours(14, 30, 0)), customerName: 'Trần Thị B', totalAmount: 300000, status: 'Đang xử lý' },
            { orderId: 'ORD003', orderDate: new Date(today.setHours(16, 0, 0)), customerName: 'Lê Văn C', totalAmount: 75000, status: 'Hoàn thành' },

            // Yesterday's data
            { orderId: 'ORD004', orderDate: new Date(yesterday.setHours(9, 0, 0)), customerName: 'Phạm Thị D', totalAmount: 220000, status: 'Hoàn thành' },
            { orderId: 'ORD005', orderDate: new Date(yesterday.setHours(11, 45, 0)), customerName: 'Hoàng Văn E', totalAmount: 500000, status: 'Hoàn thành' },

            // Last 7 days data (example within range)
            { orderId: 'ORD006', orderDate: new Date(new Date().setDate(today.getDate() - 3)), customerName: 'Vũ Thị G', totalAmount: 180000, status: 'Đang xử lý' },
            { orderId: 'ORD007', orderDate: new Date(new Date().setDate(today.getDate() - 6)), customerName: 'Đặng Văn H', totalAmount: 400000, status: 'Hoàn thành' },

            // This month's data (examples)
            { orderId: 'ORD008', orderDate: new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth(), 5, 10, 0, 0), customerName: 'Bùi Thị K', totalAmount: 900000, status: 'Hoàn thành' },
            { orderId: 'ORD009', orderDate: new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth(), 15, 13, 0, 0), customerName: 'Đỗ Văn L', totalAmount: 120000, status: 'Đã hủy' },
            { orderId: 'ORD010', orderDate: new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth(), 20, 17, 0, 0), customerName: 'Trần Văn M', totalAmount: 650000, status: 'Hoàn thành' },

            // Last month's data (examples)
            { orderId: 'ORD011', orderDate: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), 10, 9, 0, 0), customerName: 'Lý Thị N', totalAmount: 280000, status: 'Hoàn thành' },
            { orderId: 'ORD012', orderDate: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), 25, 16, 0, 0), customerName: 'Ngô Văn P', totalAmount: 700000, status: 'Đang xử lý' },

            // Data from previous quarter or older to test filtering
            { orderId: 'ORD013', orderDate: new Date(today.getFullYear(), today.getMonth() - 4, 1, 10, 0, 0), customerName: 'Chu Thị Q', totalAmount: 350000, status: 'Hoàn thành' },
            { orderId: 'ORD014', orderDate: new Date(today.getFullYear() - 1, 1, 15, 11, 0, 0), customerName: 'Dương Văn R', totalAmount: 800000, status: 'Hoàn thành' },
        ];
    }

    // --- Filtering Logic ---
    applyDateFilter(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        switch (this.selectedDateFilter) {
            case 'today':
                startDate = new Date(today);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'yesterday':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 1);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'last7days':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 6); // Includes today
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'thisMonth':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of current month
                break;
            case 'lastMonth':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999); // Last day of previous month
                break;
            case 'thisQuarter':
                const currentMonth = today.getMonth();
                const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
                startDate = new Date(today.getFullYear(), startMonthOfQuarter, 1);
                endDate = new Date(today.getFullYear(), startMonthOfQuarter + 3, 0, 23, 59, 59, 999); // Last day of current quarter
                break;
            case 'custom':
                if (this.customStartDate) {
                    startDate = new Date(this.customStartDate);
                    startDate.setHours(0, 0, 0, 0);
                }
                if (this.customEndDate) {
                    endDate = new Date(this.customEndDate);
                    endDate.setHours(23, 59, 59, 999);
                }
                if (startDate && endDate && startDate > endDate) {
                    this.showNotification("error", "Lỗi", "Ngày bắt đầu không được lớn hơn ngày kết thúc.");
                    this.filteredSalesData = [];
                    this.calculateReportSummary();
                    return;
                }
                break;
        }

        this.filteredSalesData = this.allSalesData.filter(order => {
            const orderDateTime = new Date(order.orderDate);
            orderDateTime.setHours(order.orderDate.getHours(), order.orderDate.getMinutes(), order.orderDate.getSeconds(), order.orderDate.getMilliseconds());

            const isAfterStartDate = startDate ? orderDateTime >= startDate : true;
            const isBeforeEndDate = endDate ? orderDateTime <= endDate : true;

            return isAfterStartDate && isBeforeEndDate;
        });

        this.calculateReportSummary();
    }

    private calculateReportSummary(): void {
        this.totalRevenue = 0;
        this.totalOrders = 0;
        this.totalItemsSold = 0; // Để đơn giản, giả sử mỗi đơn hàng có 1 sản phẩm. Thực tế bạn sẽ cần mock data chi tiết hơn.

        this.filteredSalesData.forEach(order => {
            if (order.status === 'Hoàn thành') { // Chỉ tính doanh thu từ các đơn hàng hoàn thành
                this.totalRevenue += order.totalAmount;
                this.totalOrders++;
                // Để mock đơn giản, chúng ta giả định mỗi đơn hàng có ít nhất 1 sản phẩm bán ra.
                // Trong thực tế, bạn sẽ cần dữ liệu chi tiết hơn về các mặt hàng trong mỗi đơn.
                this.totalItemsSold += 1; // Giả định mỗi đơn hàng có ít nhất 1 sản phẩm đã bán.
            }
        });
    }

    resetFilters(): void {
        this.selectedDateFilter = 'thisMonth';
        this.customStartDate = null;
        this.customEndDate = null;
        this.applyDateFilter();
    }

    // --- Notification (add if you don't have it, adjust as needed) ---
    notificationVisible: boolean = false;
    notificationType: 'success' | 'error' | 'warning' = 'success';
    notificationTitle: string = '';
    notificationMessage: string = '';

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