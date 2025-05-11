import { Component, OnInit } from "@angular/core";
import { Product } from "../../../shared/interfaces/product.interface";
import { Category } from "../../../shared/interfaces/category.interface";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProductItemComponent } from "../../../shared/components/product/product_item.component";
import { CategoriesService } from "../../../core/services/categories.service";

@Component({
    selector: "app-customer-products",
    standalone: true,
    imports: [FormsModule, CommonModule, ProductItemComponent],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class CustomerProductsComponent implements OnInit {
    categories: Category[] = [];
    mockProducts: Product[] = [];

    visibleCategoriesCount = 6;
    showMoreCategories = false;

    currentPage = 1;
    pageSize = 8;
    totalRecords = 0;
    totalPages = 0;
    pages: number[] = [];

    constructor(private categoriesService: CategoriesService) { }

    ngOnInit(): void {
        this.loadMockData();
        this.loadFilteredCategories();
        this.updatePagination();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedProducts();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedProducts();
        }
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.updateDisplayedProducts();
    }

    loadMockData(): void {
        this.mockProducts = [
            { id: 1, name: "Sản phẩm 1", description: "Mô tả sản phẩm 1", price: 100, discount: 10, stockQuantity: 0, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 2, name: "Sản phẩm 2", description: "Mô tả sản phẩm 2", price: 200, discount: 20, stockQuantity: 20, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 2 },
            { id: 3, name: "Sản phẩm 3", description: "Mô tả sản phẩm 3", price: 150, discount: 0, stockQuantity: 15, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 4, name: "Sản phẩm 4", description: "Mô tả sản phẩm 4", price: 300, discount: 5, stockQuantity: 30, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 3 },
            { id: 5, name: "Sản phẩm 5", description: "Mô tả sản phẩm 5", price: 120, discount: 15, stockQuantity: 10, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 2 },
            { id: 6, name: "Sản phẩm 6", description: "Mô tả sản phẩm 6", price: 250, discount: 25, stockQuantity: 5, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 7, name: "Sản phẩm 7", description: "Mô tả sản phẩm 7", price: 180, discount: 0, stockQuantity: 25, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 3 },
            { id: 8, name: "Sản phẩm 8", description: "Mô tả sản phẩm 8", price: 350, discount: 10, stockQuantity: 12, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 2 },
            { id: 9, name: "Sản phẩm 9", description: "Mô tả sản phẩm 9", price: 90, discount: 5, stockQuantity: 18, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 10, name: "Sản phẩm 10", description: "Mô tả sản phẩm 10", price: 400, discount: 30, stockQuantity: 8, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 3 },
            { id: 11, name: "Sản phẩm 11", description: "Mô tả sản phẩm 11", price: 220, discount: 0, stockQuantity: 22, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 2 },
            { id: 12, name: "Sản phẩm 12", description: "Mô tả sản phẩm 12", price: 160, discount: 20, stockQuantity: 14, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
        ];
    }

    private loadFilteredCategories(): void {
        this.categoriesService.getCategoryValue().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.categories = response.data.map((category: any) => ({
                        id: category.id,
                        name: category.name,
                    }));
                }
            },
            error: (error: any) => {
                console.error("Lỗi khi tải danh mục:", error);
            },
        });
    }

    get displayedCategories(): Category[] {
        return this.showMoreCategories ? this.categories : this.categories.slice(0, this.visibleCategoriesCount);
    }

    toggleShowMoreCategories(): void {
        this.showMoreCategories = !this.showMoreCategories;
    }

    getCategoryProductCountMock(categoryId: number): number {
        return this.mockProducts.filter(product => product.categoryID === categoryId).length;
    }

    get showMoreButtonVisible(): boolean {
        return this.categories.length > this.visibleCategoriesCount && !this.showMoreCategories;
    }

    get showLessButtonVisible(): boolean {
        return this.categories.length > this.visibleCategoriesCount && this.showMoreCategories;
    }

    get displayedProducts(): Product[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.mockProducts.slice(startIndex, endIndex);
    }

    private updatePagination(): void {
        this.totalRecords = this.mockProducts.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.generatePageArray();
    }

    private generatePageArray(): void {
        this.pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
        }
    }

    private updateDisplayedProducts(): void {
    }
}