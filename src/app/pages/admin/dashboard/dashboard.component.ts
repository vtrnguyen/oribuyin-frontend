import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../../core/services/users.service";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { OrderService } from "../../../core/services/order.service";

@Component({
    selector: "app-admin-dashboard",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
    ],
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
    userCounter: number = 0;
    productCounter: number = 0;
    recentOrders: any[] = [];
    currentMonthRevenue: number = 0;

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";
    selectedRoleFilter: string = "";

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
