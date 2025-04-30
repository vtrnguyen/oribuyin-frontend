import { Component, OnInit } from "@angular/core";
import { Product } from "../../../shared/interfaces/product.interface";
import { ProductsService } from "../../../core/services/products.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";

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
export class StaffStocksComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    selectedProducts: Product[] = [];
    selectedProductsToImport: Product[] = [];
    isImportStockModalOpen: boolean = false;
    importQuantities: { [productID: number]: number } = {};
    searchKeyworrd: string = "";

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(private productsService: ProductsService) { }

    ngOnInit(): void {
        this.filteredProducts = [...this.products];
        this.loadAllProducts();
    }

    private loadAllProducts(): void {
        this.productsService.getAllProducts().subscribe({
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
                    }));
                    this.filteredProducts = [...this.products];
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Lỗi khi tải danh sách sản phẩm");
            },
        });
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
        const searchValue = target.value.trim().toLowerCase();

        this.searchProducts(searchValue);
    }

    searchProducts(inputValue: string): void {
        this.searchKeyworrd = inputValue.toLowerCase();
        this.filteredProducts = this.products.filter((product) =>
            product.name.toLowerCase().includes(this.searchKeyworrd),
        );
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
            this.selectedProducts.length === this.filteredProducts.length
        );
    }

    openImportStockModal(): void {
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
        if (this.selectedProductsToImport && this.selectedProductsToImport.length === 1) {
            const product = this.selectedProductsToImport[0];
            const newQuantity = this.importQuantities[product.id];
            if (newQuantity !== undefined) {
                this.productsService.updateProductStock(product.id, newQuantity).subscribe({
                    next: (response: any) => {
                        if (response && response.code === 1) {
                            this.showNotification("success", "Thành công", `Cập nhật số lượng tồn kho cho sản phẩm ${product.name} thành công`)
                            this.loadAllProducts();
                        }
                    },
                    error: (error: any) => {
                        this.showNotification("error", "Lỗi", `Lỗi khi cập nhật số lượng tồn kho cho sản phẩm ${product.name}`);
                    },
                })
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
                        this.loadAllProducts();
                    }
                },
                error: (errpr: any) => {
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