import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Category } from "../../../shared/interfaces/category.interface";
import { Product } from "../../../shared/interfaces/product.interface";
import { CategoriesService } from "../../../core/services/categories.service";
import { ProductsService } from "../../../core/services/products.service";
import { Notification } from "../../../shared/types/notification.type";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { of, switchMap } from "rxjs";
import { ProductItemComponent } from "../../../shared/components/product/product_item.component";

@Component({
    selector: "app-customer-detail-category",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
        ProductItemComponent,
    ],
    templateUrl: "./detail_category.component.html",
    styleUrls: ["./detail_category.component.scss"],
})
export class CustomerDetailCategoryComponent implements OnInit {
    category: Category | null = null;
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
        this.loadCategoryAndProducts();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadCategoryAndProducts();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadCategoryAndProducts();
        }
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadCategoryAndProducts();
    }

    private loadCategoryAndProducts(): void {
        this.activatedRoute.paramMap
            .pipe(
                switchMap(params => {
                    const categoryID = Number(params.get("id"));
                    return this.categoriesService.getCategoryByID(categoryID).pipe(
                        switchMap(categoryResponse => {
                            if (categoryResponse && categoryResponse.code === 1) {
                                this.category = {
                                    id: categoryResponse.data.id,
                                    name: categoryResponse.data.name,
                                    description: categoryResponse.data.description,
                                    image: categoryResponse.data.image,
                                };
                                return this.productsService.getProductsByCategoryID(categoryID, this.currentPage, this.pageSize);
                            } else {
                                this.showNotification("error", "Lỗi", "Không tải được thông tin danh mục");
                                return of(null);
                            }
                        }),
                    );
                }),
            )
            .subscribe({
                next: (productResponse: any) => {
                    if (productResponse && productResponse.code === 1) {
                        this.products = productResponse.data.map((product: any) => ({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            discount: product.discount,
                            stockQuantity: product.stock_quantity,
                            image: product.image,
                            categoryID: product.category_id,
                        } as Product));

                        this.totalRecords = productResponse.total_records;
                        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                        this.generatePageArray();
                    } else if (productResponse) {
                        this.showNotification("error", "Lỗi", productResponse.message || "Không tải được danh sách sản phẩm.");
                        this.products = [];
                        this.totalRecords = 0;
                        this.totalPages = 0;
                        this.pages = [];
                    }
                },
                error: (error: any) => {
                    this.showNotification("error", "Lỗi", "Lỗi khi tải thông tin sản phẩm");
                    this.category = null;
                    this.products = [];
                    this.totalRecords = 0;
                    this.totalPages = 0;
                    this.pages = [];
                },
            })
    }

    private generatePageArray(): void {
        this.pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow && endPage === this.totalPages) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
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