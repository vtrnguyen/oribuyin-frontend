import { Component, OnInit, OnDestroy } from "@angular/core";
import { Product } from "../../../shared/interfaces/product.interface";
import { Category } from "../../../shared/interfaces/category.interface";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProductItemComponent } from "../../../shared/components/product/product_item.component";
import { CategoriesService } from "../../../core/services/categories.service";
import { ProductsService } from "../../../core/services/products.service";
import { Subject, takeUntil } from "rxjs";
import { CategoryWithCount } from "../../../shared/interfaces/category_with_count.interface";

@Component({
    selector: "app-customer-products",
    standalone: true,
    imports: [FormsModule, CommonModule, ProductItemComponent],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class CustomerProductsComponent implements OnInit, OnDestroy {
    categoriesWithCount: CategoryWithCount[] = [];
    products: Product[] = [];

    currentPage = 1;
    pageSize = 9;
    totalRecords = 0;
    totalPages = 0;
    pages: number[] = [];

    selectedCategory: number | null = null;
    minPrice: number | null = null;
    maxPrice: number | null = null;
    selectedRating: number | null = null;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    loadProducts(): void {
        this.productsService.getFilteredProducts(
            this.currentPage,
            this.pageSize,
            this.selectedCategory,
            this.minPrice,
            this.maxPrice,
            this.selectedRating
        )
            .pipe(takeUntil(this.ngUnsubscribe))
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
                        this.loadAndProcessCategories();
                    } else if (productResponse) {
                        this.products = [];
                        this.totalRecords = 0;
                        this.totalPages = 0;
                        this.pages = [];
                    }
                },
                error: (error: any) => {
                    this.products = [];
                    this.totalRecords = 0;
                    this.totalPages = 0;
                    this.pages = [];
                },
            });
    }

    loadAndProcessCategories(): void {
        this.categoriesService.getCategoryValue()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (categoryResponse: any) => {
                    if (categoryResponse && categoryResponse.code === 1) {
                        const processedCategories: CategoryWithCount[] = categoryResponse.data.map((cat: any) => ({
                            category: { id: cat.id, name: cat.name },
                            productCount: this.products.filter(p => p.categoryID === cat.id).length,
                        }));
                        processedCategories.sort((a, b) => b.productCount - a.productCount);
                        this.categoriesWithCount = processedCategories;
                    }
                },
                error: (error: any) => {
                },
            });
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadProducts();
        } else if (this.totalPages > 5 && this.pages.slice(-1)[0] < this.totalPages) {
            this.generatePageArray();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
        } else if (this.totalPages > 5 && this.pages[0] > 1) {
            this.generatePageArray();
        }
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadProducts();
    }

    onCategoryChange(event: any): void {
        this.selectedCategory = parseInt(event.target.value, 10) || null;
        this.currentPage = 1;
        this.loadProducts();
    }

    applyPriceFilter(): void {
        this.currentPage = 1;
        this.loadProducts();
    }

    onRatingChange(event: any): void {
        this.selectedRating = parseInt(event.target.value, 10) || null;
        this.currentPage = 1;
        this.loadProducts();
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
}