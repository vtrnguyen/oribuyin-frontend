import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

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

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.loadProductID();
    }

    private loadProductID(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.productID = Number(params.get("id"));
        });
    }
}
