import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Category } from "../../../shared/interfaces/category.interface";
import { CategoriesService } from "../../../core/services/categories.service";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { RouterLink } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { Product } from "../../../shared/interfaces/product.interface";
import { ProductItemComponent } from "../../../shared/components/product/product_item.component";

@Component({
    selector: "app-customer-home",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
        RouterLink,
        ProductItemComponent,
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

    suggestedProducts: Product[] = [];

    constructor(
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadAllCategories();
        this.loadSuggestedProducts();
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

    private loadSuggestedProducts(): void {
        this.productsService.getSuggestedProducts().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.suggestedProducts = response.data.map((suggestedProduct: any) => ({
                        id: suggestedProduct.id,
                        name: suggestedProduct.name,
                        description: suggestedProduct.description,
                        price: suggestedProduct.price,
                        discount: suggestedProduct.discount,
                        stockQuantity: suggestedProduct.stock_quantity,
                        image: suggestedProduct.image,
                        categoryID: suggestedProduct.category_id,
                    }));
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không tải được danh sách sản phẩm gợi ý");
            },
        })
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
