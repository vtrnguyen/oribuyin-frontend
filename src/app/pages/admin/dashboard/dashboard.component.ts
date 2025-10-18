import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UsersService } from "../../../core/services/users.service";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { OrderService } from "../../../core/services/order.service";
import { Chart, registerables } from "chart.js";
import { OrderStatusBadgeComponent } from "../../../shared/components/order_status_badge/order_status_badge.component";
import { ReviewsService } from "../../../core/services/review.service";

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
        OrderStatusBadgeComponent,
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
    topSellingProducts: any[] = [];

    // monthly revenue by year properties
    availableYears: number[] = [];
    selectedYear: number = new Date().getFullYear();

    // reviews properties
    reviews: any[] = [];
    reviewsTotal: number = 0;
    reviewsPage: number = 1;
    reviewsPageSize: number = 5;
    reviewsRatingFilter: number | null = null; // null = all, 1-5 = filter by rating

    @ViewChild("revenueChart") revenueChartRef!: ElementRef<HTMLCanvasElement>;
    private revenueChart: Chart | undefined;

    constructor(
        private usersService: UsersService,
        private productsService: ProductsService,
        private ordersService: OrderService,
        private reviewsService: ReviewsService,
    ) { }

    ngOnInit(): void {
        this.getNumberOfUsers();
        this.getNumberOfProducts();
        this.getRecentOrders();
        this.getCurrentMonthRevenue();

        this.loadAvailableYears(6);
        this.selectedYear = new Date().getFullYear();
        this.loadMonthlyRevenueByYear(this.selectedYear);

        this.getTopSellingProducts();
        this.loadReviews(this.reviewsPage);
    }

    ngAfterViewInit(): void {
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

    private renderRevenueChart(): void {
        if (!this.revenueChartRef || !this.revenueChartRef.nativeElement) {
            console.error('Chart canvas element not found');
            return;
        }

        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = monthLabels;
        const data = this.monthlyRevenueData.map(d => Number(d.revenue) || 0);

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

    private getTopSellingProducts(limit: number = 12): void {
        this.productsService.getTopSelling(limit).subscribe({
            next: (response: any) => {
                if (response && response.code === 1 && Array.isArray(response.data)) {
                    this.topSellingProducts = response.data;
                } else {
                    this.topSellingProducts = [];
                }
            },
            error: (error: any) => {
                this.topSellingProducts = [];
            },
        });
    }

    private loadAvailableYears(lookback: number = 5): void {
        const currentYear = new Date().getFullYear();
        this.availableYears = [];
        for (let i = 0; i < lookback; i++) {
            this.availableYears.push(currentYear - i);
        }
    }

    private loadMonthlyRevenueByYear(year: number): void {
        this.ordersService.getMonthlyRevenueByYear(year).subscribe({
            next: (response: any) => {
                if (response && response.code === 1 && Array.isArray(response.data)) {
                    const monthsMap = new Map<number, number>();
                    for (let i = 1; i <= 12; i++) monthsMap.set(i, 0);

                    for (const m of response.data) {
                        const monthNum = Number(m.month);
                        const revenueVal = Number(m.revenue) || 0;
                        monthsMap.set(monthNum, revenueVal);
                    }

                    // set monthlyRevenueData in same format used by renderRevenueChart
                    this.monthlyRevenueData = Array.from({ length: 12 }).map((_, idx) => {
                        const monthIndex = idx + 1;
                        return { month: `Tháng ${monthIndex}`, revenue: monthsMap.get(monthIndex) || 0 };
                    });

                    // re-render chart
                    this.renderRevenueChart();
                } else {
                    // fallback: zeros
                    this.monthlyRevenueData = Array.from({ length: 12 }).map((_, idx) => {
                        const monthIndex = idx + 1;
                        return { month: `Tháng ${monthIndex}`, revenue: 0 };
                    });
                    this.renderRevenueChart();
                }
                error: (error: any) => {
                    this.monthlyRevenueData = Array.from({ length: 12 }).map((_, idx) => {
                        const monthIndex = idx + 1;
                        return { month: `Tháng ${monthIndex}`, revenue: 0 };
                    });
                    this.renderRevenueChart();
                }
            }
        });
    }

    onYearChange(yearValue: string | number) {
        const year = typeof yearValue === 'string' ? Number(yearValue) : yearValue;
        if (!isNaN(year)) {
            this.selectedYear = year;
            this.loadMonthlyRevenueByYear(year);
        }
    }

    loadReviews(page: number = 1): void {
        this.reviewsPage = page;
        this.reviewsService.getReviewsByAvgRating(this.reviewsPage, this.reviewsPageSize, this.reviewsRatingFilter).subscribe({
            next: (response: any) => {
                if (response && response.code === 1 && response.data) {
                    const payload = response.data;
                    this.reviewsTotal = payload.total || 0;
                    this.reviewsPage = payload.page || this.reviewsPage;
                    this.reviewsPageSize = payload.pageSize || this.reviewsPageSize;
                    this.reviews = payload.data || [];
                } else {
                    this.reviews = [];
                    this.reviewsTotal = 0;
                }
            },
            error: (error: any) => {
                this.reviews = [];
                this.reviewsTotal = 0;
            },
        });
    }

    setReviewsRatingFilter(rating: number | null): void {
        this.reviewsRatingFilter = rating;
        this.reviewsPage = 1;
        this.loadReviews(1);
    }

    get reviewsTotalPages(): number {
        return Math.max(1, Math.ceil(this.reviewsTotal / this.reviewsPageSize));
    }

    goToPrevReviewsPage() {
        if (this.reviewsPage > 1) {
            this.loadReviews(this.reviewsPage - 1);
        }
    }
    goToNextReviewsPage() {
        if (this.reviewsPage < this.reviewsTotalPages) {
            this.loadReviews(this.reviewsPage + 1);
        }
    }
}