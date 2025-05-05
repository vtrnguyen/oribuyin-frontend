import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Product } from "../../interfaces/product.interface";

@Component({
    selector: "app-product-item-component",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
    ],
    templateUrl: "./product_item.component.html",
    styleUrls: ["./product_item.component.scss"],
})
export class ProductItemComponent {
    @Input() product!: Product;
}
