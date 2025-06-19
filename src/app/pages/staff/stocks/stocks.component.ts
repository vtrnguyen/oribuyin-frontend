import { Component, OnInit, OnDestroy } from "@angular/core"; // Add OnDestroy
import { Product } from "../../../shared/interfaces/product.interface";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { Subject, takeUntil } from "rxjs"; // Import Subject and takeUntil

@Component({
    selector: "app-staff-stocks",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./stocks.component.html",
    styleUrls: ["./stocks.component.scss"],
})
export class StaffStocksComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    selectedProducts: Product[] = [];
    selectedProductsToImport: Product[] = [];
    isImportStockModalOpen: boolean = false;
    importQuantities: { [productID: number]: number } = {};
    searchKeyword: string = "";

    currentPage = 1;
    pageSize = 20;
    totalRecords = 0;
    totalPages = 0;
    pages: number[] = [];

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    private ngUnsubscribe = new Subject<void>();

    constructor(private productsService: ProductsService) { }

    ngOnInit(): void {
        this.loadProductsForStocks();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private loadProductsForStocks(): void {
        this.productsService.getFilteredProducts(
            this.currentPage,
            this.pageSize,
            null,
            null,
            null,
            null,
        )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (response: any) => {
                    if (response && response.code === 1) {
                        this.products = response.data.map((product: any) => ({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            discount: product.discount,
                            stockQuantity: product.stock_quantity,
                            image: product.image,
                            categoryID: product.category_id,
                        } as Product));
                        this.filteredProducts = [...this.products];
                        this.totalRecords = response.total_records;
                        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                        this.generatePageArray();
                        this.selectedProducts = [];
                    } else if (response) {
                        this.products = [];
                        this.filteredProducts = [];
                        this.totalRecords = 0;
                        this.totalPages = 0;
                        this.pages = [];
                        this.selectedProducts = [];
                    }
                },
                error: (error: any) => {
                    this.products = [];
                    this.filteredProducts = [];
                    this.totalRecords = 0;
                    this.totalPages = 0;
                    this.pages = [];
                    this.selectedProducts = [];
                    this.showNotification("error", "Lỗi", "Không thể tải được thông tin sản phẩm.");
                },
            });
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadProductsForStocks();
        } else if (this.totalPages > 5 && this.pages.slice(-1)[0] < this.totalPages) {
            this.generatePageArray();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProductsForStocks();
        } else if (this.totalPages > 5 && this.pages[0] > 1) {
            this.generatePageArray();
        }
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadProductsForStocks();
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

    onSelectAllProducts(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectAllProducts(input.checked);
    }

    selectAllProducts(checked: boolean): void {
        if (checked) {
            this.selectedProducts = [...this.filteredProducts];
        } else {
            this.selectedProducts = [];
        }
    }

    onSearchInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchKeyword = target.value.trim();

        this.currentPage = 1;
        this.loadProductsForStocks();
    }

    toggleProductSelection(product: Product): void {
        const index = this.selectedProducts.findIndex((p) => p.id === product.id);

        if (index > -1) {
            this.selectedProducts.splice(index, 1);
        } else {
            this.selectedProducts.push(product);
        }
    }

    isSelected(product: Product): boolean {
        return this.selectedProducts.some((p) => p.id === product.id);
    }

    isAllSelected(): boolean {
        return (
            this.filteredProducts.length > 0 &&
            this.selectedProducts.length === this.filteredProducts.length &&
            this.filteredProducts.every(p => this.isSelected(p))
        );
    }

    openImportStockModal(): void {
        if (this.selectedProducts.length === 0) {
            this.showNotification("warning", "Thông báo", "Vui lòng chọn ít nhất một sản phẩm để nhập kho.");
            return;
        }
        this.selectedProductsToImport = [...this.selectedProducts];
        this.importQuantities = {};
        this.selectedProductsToImport.forEach((product) => {
            this.importQuantities[product.id] = product.stockQuantity;
        });
        this.isImportStockModalOpen = true;
    }

    closeImportStockModal(): void {
        this.selectedProducts = [];
        this.isImportStockModalOpen = false;
    }

    confirmImportStock(): void {
        if (!this.selectedProductsToImport || this.selectedProductsToImport.length === 0) {
            this.showNotification("warning", "Thông báo", "Không có sản phẩm nào được chọn để nhập kho.");
            return;
        }

        for (const product of this.selectedProductsToImport) {
            const quantity = this.importQuantities[product.id];
            if (quantity === null || quantity < 0) {
                this.showNotification("warning", "Lỗi", `Số lượng nhập kho cho sản phẩm "${product.name}" không hợp lệ. Vui lòng nhập số dương.`);
                return;
            }
        }

        if (this.selectedProductsToImport.length === 1) {
            const product = this.selectedProductsToImport[0];
            const newQuantity = this.importQuantities[product.id];
            if (newQuantity !== undefined) {
                this.productsService.updateProductStock(product.id, newQuantity).subscribe({
                    next: (response: any) => {
                        if (response && response.code === 1) {
                            this.showNotification("success", "Thành công", `Cập nhật số lượng tồn kho cho sản phẩm ${product.name} thành công`);
                            this.loadProductsForStocks();
                        }
                    },
                    error: (error: any) => {
                        this.showNotification("error", "Lỗi", `Lỗi khi cập nhật số lượng tồn kho cho sản phẩm ${product.name}`);
                    },
                });
            }
        } else if (this.selectedProductsToImport.length >= 2) {
            const productsToUpdate = this.selectedProductsToImport.map(product => ({
                id: product.id,
                stockQuantity: this.importQuantities[product.id],
            }));

            this.productsService.bulkUpdateProductStock(productsToUpdate).subscribe({
                next: (response: any) => {
                    if (response && response.code === 1) {
                        this.showNotification("success", "Thành công", "Đã cập nhật thành công số lượng tồn kho cho các sản phẩm");
                        this.loadProductsForStocks();
                    }
                },
                error: (error: any) => {
                    this.showNotification("error", "Lỗi", `Lỗi khi cập nhật số lượng tồn kho cho các sản phẩm`);
                },
            });
        }

        this.closeImportStockModal();
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