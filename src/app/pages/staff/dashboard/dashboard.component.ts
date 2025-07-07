import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { OrderService } from "../../../core/services/order.service";

interface Order {
    id: string;
    customerName: string;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface LowStockProduct {
    name: string;
    sku: string;
    quantity: number;
    image?: string;
}

interface WeeklyPerformanceDay {
    name: string;
    orders: number;
    percentage: number;
}

@Component({
    selector: "app-staff-dashboard",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class StaffDashboardComponent implements OnInit {
    currentDate = new Date();
    pendingOrders = 12;
    processedToday = 8;
    lowStockItems = 5;
    totalInventory = 1250;

    recentOrders: Order[] = [
        {
            id: "ORD001",
            customerName: "Nguyễn Văn A",
            total: 450000,
            status: "pending"
        },
        {
            id: "ORD002",
            customerName: "Trần Thị B",
            total: 890000,
            status: "processing"
        },
        {
            id: "ORD003",
            customerName: "Lê Văn C",
            total: 320000,
            status: "completed"
        },
        {
            id: "ORD004",
            customerName: "Phạm Thị D",
            total: 670000,
            status: "pending"
        }
    ];

    lowStockProducts: LowStockProduct[] = [
        {
            name: "Áo thun nam basic",
            sku: "AT001",
            quantity: 3,
            image: "images/default_product.png"
        },
        {
            name: "Quần jean nữ",
            sku: "QJ002",
            quantity: 1,
            image: "images/default_product.png"
        },
        {
            name: "Giày sneaker",
            sku: "GS003",
            quantity: 2,
            image: "images/default_product.png"
        }
    ];

    weeklyPerformance: WeeklyPerformanceDay[] = [
        { name: "T2", orders: 15, percentage: 75 },
        { name: "T3", orders: 12, percentage: 60 },
        { name: "T4", orders: 18, percentage: 90 },
        { name: "T5", orders: 10, percentage: 50 },
        { name: "T6", orders: 20, percentage: 100 },
        { name: "T7", orders: 8, percentage: 40 },
        { name: "CN", orders: 5, percentage: 25 }
    ];

    constructor(
        private productsService: ProductsService,
        private ordersService: OrderService
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    getStatusText(status: string): string {
        const statusMap: { [key: string]: string } = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    private loadDashboardData(): void {
        this.loadTotalStock();
        this.loadTotalAlmostOutOfStockQuantity();
        this.loadTotalPendingOrders();
    }

    private loadTotalStock(): void {
        this.productsService.getTotalStock().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.totalInventory = response.data;
                } else {
                    this.totalInventory = 0;
                }
            },
            error: (error: any) => {
                this.totalInventory = 0;
            },
        });
    }

    private loadTotalAlmostOutOfStockQuantity(): void {
        this.productsService.getTotalAlmostOutOfStockQuantity().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.lowStockItems = response.data;
                } else {
                    this.lowStockItems = 0;
                }
            },
            error: (error: any) => {
                this.lowStockItems = 0;
            },
        });
    }

    private loadTotalPendingOrders(): void {
        this.ordersService.getTotalOfPendingOrders().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.pendingOrders = response.data;
                } else {
                    this.pendingOrders = 0;
                }
            },
            error: (error: any) => {
                this.pendingOrders = 0;
            },
        });
    }
}
