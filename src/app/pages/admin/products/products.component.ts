import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { CategoriesService } from "../../../core/services/categories.service";
import { Product } from "../../../shared/interfaces/product.interface";

@Component({
    selector: "app-admin-products",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
    ],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class AdminProductsComponent implements OnInit {
    products: Product[] = [];
    totalProducts: number = 0;
    categoryValues: any[] = [];
    
    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.loadCategoryValues();
    }
    
    openAddProductModal(): void {
    
    }
    
    downloadProductInfo(): void {
    
    }

    private loadAllCategories(): void {
        
    }

    private loadCategoryValues(): void {
        this.categoriesService.getCategoryValue().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.categoryValues = response.data;
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không thể tải danh sách danh mục sản phẩm");
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
