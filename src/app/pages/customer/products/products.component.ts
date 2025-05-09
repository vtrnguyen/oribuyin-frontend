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

    constructor(private categoriesService: CategoriesService) { }

    ngOnInit(): void {
        this.loadMockData();
        this.loadFilteredCategories();
    }

    loadMockData(): void {
        this.mockProducts = [
            { id: 1, name: "Sản phẩm 1", description: "Mô tả sản phẩm 1", price: 100, discount: 10, stockQuantity: 0, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 2, name: "Sản phẩm 2", description: "Mô tả sản phẩm 2", price: 200, discount: 20, stockQuantity: 20, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 2 },
            { id: 3, name: "Sản phẩm 3", description: "Mô tả sản phẩm 3", price: 150, discount: 0, stockQuantity: 15, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 1 },
            { id: 4, name: "Sản phẩm 4", description: "Mô tả sản phẩm 4", price: 300, discount: 5, stockQuantity: 30, image: "dien-thoai-thong-minh-samsung-galaxy-s24-ultra.webp", categoryID: 3 },
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
}