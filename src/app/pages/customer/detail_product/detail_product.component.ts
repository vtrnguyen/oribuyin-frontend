import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../../shared/interfaces/product.interface";
import { Review } from "../../../shared/interfaces/review.interface";
import { ProductsService } from "../../../core/services/products.service";

@Component({
    selector: "app-customer-detail-product",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./detail_product.component.html",
    styleUrls: ["./detail_product.component.scss"],
})
export class CustomerDetailProductComponent implements OnInit {
    productID: number = 0;
    product: Product | null = null;
    reviews: Review[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.loadDetailProduct();
    }

    private loadDetailProduct(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.productID = Number(params.get("id"));
            if (this.productID) {
                this.productsService.getProductByID(this.productID).subscribe({
                    next: (response: any) => {
                        if (response && response.code === 1 && response.data) {
                            this.product = {
                                id: response.data.product.id,
                                name: response.data.product.name,
                                description: response.data.product.description,
                                price: response.data.product.price,
                                discount: response.data.product.discount,
                                stockQuantity: response.data.product.stock_quantity,
                                image: response.data.product.image,
                                categoryID: response.data.product.category_id,
                            };

                            this.reviews = response.data.reviews.map((review: any) => ({
                                id: review.id,
                                userAvatar: review.user_avatar,
                                userFullName: review.user_full_name,
                                timestamp: review.timestamps,
                                rating: review.rating,
                                comment: review.comment,
                                userID: review.user_id,
                                productID: review.product_id,
                            }));

                        } else {
                            this.product = null;
                            this.reviews = [];
                        }
                    },
                    error: (error: any) => {
                        this.product = null;
                        this.reviews = [];
                    },
                });
            }
        });
    }

    calculateDiscountedPrice(): number {
        if (this.product && this.product.discount > 0) {
            return this.product.price * (1 - this.product.discount / 100);
        }
        return this.product ? this.product.price : 0;
    }
}