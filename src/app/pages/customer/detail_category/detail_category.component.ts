import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-customer-detail-category",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./detail_category.component.html",
    styleUrls: ["./detail_category.component.scss"],
})
export class CustomerDetailCategoryComponent implements OnInit {
    categoryID: number = 0;

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.loadCategoryID();
    }

    private loadCategoryID(): void {
        this.activatedRoute.paramMap.subscribe(params => {
            this.categoryID = Number(params.get("id"));
        });
    }
}
