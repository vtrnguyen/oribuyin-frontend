import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductsService } from "../../../core/services/products.service";
import { Product } from "../../../shared/interfaces/product.interface";
import { ProductItemComponent } from "../../../shared/components/product/product_item.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-customer-searches",
    standalone: true,
    imports: [CommonModule, FormsModule, ProductItemComponent],
    templateUrl: "./searches.component.html",
    styleUrls: ["./searches.component.scss"],
})
export class CustomerSearchesComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    currentPage = 1;
    pageSize = 8;
    totalRecords = 0;
    totalPages = 0;
    pages: number[] = [];
    keyword: string = "";

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.keyword = params['q'] || "";
            this.currentPage = 1;
            this.loadProducts();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    loadProducts(): void {
        if (this.keyword && this.keyword.trim() !== "") {
            this.productsService.searchProductsByName(this.keyword)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    next: (res: any) => {
                        if (res && res.code === 1) {
                            this.totalRecords = res.data.length;
                            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                            const start = (this.currentPage - 1) * this.pageSize;
                            this.products = res.data.slice(start, start + this.pageSize);
                            this.generatePageArray();
                        } else {
                            this.products = [];
                            this.totalRecords = 0;
                            this.totalPages = 0;
                            this.pages = [];
                        }
                    },
                    error: () => {
                        this.products = [];
                        this.totalRecords = 0;
                        this.totalPages = 0;
                        this.pages = [];
                    }
                });
        } else {
            this.products = [];
            this.totalRecords = 0;
            this.totalPages = 0;
            this.pages = [];
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadProducts();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
        }
    }

    changePage(page: number): void {
        this.currentPage = page;
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