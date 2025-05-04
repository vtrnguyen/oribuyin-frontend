import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Category } from "../../../shared/interfaces/category.interface";
import { Product } from "../../../shared/interfaces/product.interface";
import { CategoriesService } from "../../../core/services/categories.service";
import { ProductsService } from "../../../core/services/products.service";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";

@Component({
    selector: "app-customer-detail-category",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        NotificationComponent,
    ],
    templateUrl: "./detail_category.component.html",
    styleUrls: ["./detail_category.component.scss"],
})
export class CustomerDetailCategoryComponent implements OnInit {
    category: Category | null = null;
    allProducts: Product[] = [];
    products: Product[] = [];

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    currentPage: number = 1;
    pageSize: number = 8;
    totalRecords: number = 0;
    totalPages: number = 0;
    pages: number[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadCategoryInfo();
        this.mockProducts();
        this.paginateProducts();
    }

    private getCategoryID(): number {
        let categoryID: number = 0;

        this.activatedRoute.paramMap.subscribe(params => {
            categoryID = Number(params.get("id"));
        });

        return categoryID;
    }

    loadCategoryInfo(): void {
        const categoryID = this.getCategoryID();

        this.categoriesService.getCategoryByID(categoryID).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.category = {
                        id: response.data.id,
                        name: response.data.name,
                        description: response.data.description,
                        image: response.data.image,
                    }
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không tải được danh sách sản phẩm tương ứng với danh mục");
            },
        });
    }

    mockProducts(): void {
        for (let i = 1; i <= 35; i++) {
            this.allProducts.push({
                id: i,
                name: `Sản phẩm ${i}`,
                description: `Mô tả chi tiết cho sản phẩm ${i} thuộc danh mục ${this.category?.name}.`,
                price: Math.floor(Math.random() * 10000000) + 1000000,
                discount: Math.random() < 0.3 ? Math.floor(Math.random() * 50) + 10 : 0,
                stockQuantity: Math.floor(Math.random() * 100) + 10,
                image: `images/default_product.png`,
                categoryID: this.getCategoryID(),
            });
        }
        this.totalRecords = this.allProducts.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.generatePageArray();
    }

    paginateProducts(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.products = this.allProducts.slice(startIndex, endIndex);
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.paginateProducts();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginateProducts();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginateProducts();
        }
    }

    generatePageArray(): void {
        this.pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
        }
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