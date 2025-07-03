import { CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core"; // Import OnDestroy
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
export class CustomerHomeComponent implements OnInit, AfterViewInit, OnDestroy {
    categories: Category[] = [];

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    suggestedProducts: Product[] = [];

    slides: string[] = [
        'images/slide_1.webp',
        'images/slide_2.webp',
        'images/slide_3.avif',
        'images/slide_4.avif',
        'images/slide_5.avif',
    ];
    currentSlideIndex: number = 0;
    private slideInterval: any;

    constructor(
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadAllCategories();
        this.loadSuggestedProducts();
    }

    ngAfterViewInit(): void {
        this.startSlideShow();
    }

    ngOnDestroy(): void {
        this.stopSlideShow();
    }

    startSlideShow(): void {
        this.stopSlideShow();
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 3000);
    }

    stopSlideShow(): void {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }

    nextSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }

    prevSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    }

    goToSlide(index: number): void {
        this.currentSlideIndex = index;
        this.startSlideShow();
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
                this.showNotification("error", "Lỗi", "Không tải được danh sách nhóm sản phẩm");
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