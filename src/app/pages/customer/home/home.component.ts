import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Category } from "../../../shared/interfaces/category.interface";
import { CategoriesService } from "../../../core/services/categories.service";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-customer-home",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
        RouterLink,
    ],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class CustomerHomeComponent implements OnInit {
    categories: Category[] = [];

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(private categoriesService: CategoriesService) { }

    ngOnInit(): void {
        this.loadAllCategories();
    }

    private loadAllCategories(): void {
        this.categoriesService.getAllCategories().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.categories = response.data.map((category: any) => ({
                        id: category.id,
                        name: category.name,
                        description: category.description,
                        image: category.image,
                    }));
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không tải được danh sách danh mục sản phẩm");
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
