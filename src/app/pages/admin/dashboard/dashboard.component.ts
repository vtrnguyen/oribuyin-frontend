import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../../core/services/users.service";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";

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

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";
    selectedRoleFilter: string = "";

    constructor(
        private usersService: UsersService,
        private productsService: ProductsService
    ) {}

    ngOnInit(): void {
        this.getNumberOfUsers();
        this.getNumberOfProducts();
    }

    private getNumberOfUsers(): void {
        this.usersService.getNumberOfUsers().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.userCounter = response.data;
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không thể tải số lượng người dùng");
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
                this.showNotification("error", "Lỗi", "Không thể tải số lượng sản phẩm");
            }
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
