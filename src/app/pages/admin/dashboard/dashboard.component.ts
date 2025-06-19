import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UsersService } from "../../../core/services/users.service";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { OrderService } from "../../../core/services/order.service";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

@Component({
    selector: "app-admin-dashboard",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    userCounter: number = 0;
    productCounter: number = 0;
    recentOrders: any[] = [];
    currentMonthRevenue: number = 0;
    monthlyRevenueData: MonthlyRevenue[] = [];

    @ViewChild("revenueChart") revenueChartRef!: ElementRef<HTMLCanvasElement>;
    private revenueChart: Chart | undefined;

    constructor(
        private usersService: UsersService,
        private productsService: ProductsService,
        private ordersService: OrderService,
    ) { }

    ngOnInit(): void {
        this.getNumberOfUsers();
        this.getNumberOfProducts();
        this.getRecentOrders();
        this.getCurrentMonthRevenue();
        this.initializeMonthlyRevenue(); // Đổi tên method này
    }

    ngAfterViewInit(): void {
        // Đảm bảo chart được render sau khi view đã sẵn sàng
        setTimeout(() => {
            this.renderRevenueChart();
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
    }

    private getNumberOfUsers(): void {
        this.usersService.getNumberOfUsers().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.userCounter = response.data;
                }
            },
            error: (error: any) => {
                this.userCounter = 0;
            }
        });
    }

    private getNumberOfProducts(): void {
        this.productsService.getNumberOfProducts().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.productCounter = response.data;
                }
            },
            error: (error: any) => {
                this.productCounter = 0;
            }
        });
    }

    private getRecentOrders(): void {
        this.ordersService.getRecentOrders().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.recentOrders = response.data;
                }
            },
            error: (error: any) => {
                this.recentOrders = [];
            },
        });
    }

    private getCurrentMonthRevenue(): void {
        this.ordersService.getCurrentMonthRevenue().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.currentMonthRevenue = response.data;
                } else {
                    this.currentMonthRevenue = 0;
                }
            },
            error: (error: any) => {
                this.currentMonthRevenue = 0;
            },
        });
    }

    // Đổi tên method và loại bỏ setTimeout trong đây
    private initializeMonthlyRevenue(): void {
        this.monthlyRevenueData = [
            { month: "Tháng 1", revenue: 120000000 },
            { month: "Tháng 2", revenue: 150000000 },
            { month: "Tháng 3", revenue: 130000000 },
            { month: "Tháng 4", revenue: 180000000 },
            { month: "Tháng 5", revenue: 200000000 },
            { month: "Tháng 6", revenue: 220000000 },
            { month: "Tháng 7", revenue: 190000000 },
            { month: "Tháng 8", revenue: 230000000 },
            { month: "Tháng 9", revenue: 210000000 },
            { month: "Tháng 10", revenue: 250000000 },
            { month: "Tháng 11", revenue: 270000000 },
            { month: "Tháng 12", revenue: 300000000 },
        ];
    }

    private renderRevenueChart(): void {
        // Kiểm tra xem ViewChild đã sẵn sàng chưa
        if (!this.revenueChartRef || !this.revenueChartRef.nativeElement) {
            console.error('Chart canvas element not found');
            return;
        }

        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        const labels = this.monthlyRevenueData.map(data => data.month);
        const data = this.monthlyRevenueData.map(data => data.revenue);

        const ctx = this.revenueChartRef.nativeElement.getContext('2d');
        if (ctx) {
            this.revenueChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doanh thu',
                        data: data,
                        backgroundColor: 'rgba(78, 223, 105, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Doanh thu (VNĐ)'
                            },
                            ticks: {
                                callback: function (value: any, index, values) {
                                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}