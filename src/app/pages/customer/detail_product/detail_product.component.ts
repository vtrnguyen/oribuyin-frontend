import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../../shared/interfaces/product.interface";
import { Review } from "../../../shared/interfaces/review.interface";

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

    mockProduct: Product = {
        id: 123,
        name: "Áo Thun Cotton Basic",
        description: "Áo thun cotton 100% mềm mại, thoáng mát, phù hợp cho mọi hoạt động hàng ngày.",
        price: 250000,
        discount: 15,
        stockQuantity: 150,
        image: "https://raw.githubusercontent.com/vtrnguyen/hosting-image-file/refs/heads/main/oribuyin/products/ao-so-mi-nam-oxford-cao-cap.png",
        categoryID: 1,
    };
    mockReviews: Review[] = [
        {
            id: 1,
            userAvatar: "images/default_avatar.png",
            userFullName: "Nguyễn Văn A",
            timestamp: new Date(),
            rating: 4,
            comment: "Sản phẩm tuyệt vời, chất liệu rất tốt!",
            userID: 101,
            productID: 123,
        },
        {
            id: 2,
            userAvatar: "images/default_avatar.png",
            userFullName: "Trần Thị B",
            timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
            rating: 4,
            comment: "Áo mặc khá thoải mái, giá cả hợp lý.",
            userID: 102,
            productID: 123,
        },
        {
            id: 3,
            userAvatar: "images/default_avatar.png",
            userFullName: "Lê Minh C",
            timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
            rating: 3,
            comment: "Chất liệu ổn, nhưng giao hàng hơi lâu.",
            userID: 103,
            productID: 123,
        },
    ];

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.loadProductID();
    }

    calculateDiscountedPrice(): number {
        if (this.mockProduct.discount > 0) {
            return this.mockProduct.price * (1 - this.mockProduct.discount / 100);
        }
        return this.mockProduct.price;
    }

    private loadProductID(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.productID = Number(params.get("id"));
        });
    }
}
