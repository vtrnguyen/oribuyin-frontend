import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { CategoriesService } from "../../../core/services/categories.service";
import { Product } from "../../../shared/interfaces/product.interface";
import { ProductsService } from "../../../core/services/products.service";
import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule } from "@angular/forms";
import * as XLSX from "xlsx";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-admin-products",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
        ClickOutsideModule,
    ],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categoryValues: any[] = [];
    selectedProduct: Product | null = null;
    actionsMenuButton: any;

    currentPage = 1;
    pageSize = 20;
    totalRecords = 0;
    totalPages = 0;
    pages: number[] = [];

    searchName: string = "";
    filterCategoryID: number | null = null;

    isActionsMenuOpen: boolean = false;
    isAddProductModalOpen: boolean = false;
    isViewProductModalOpen: boolean = false;
    isEditProductModalOpen: boolean = false;
    isDeleteProductModalOpen: boolean = false;

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    newProduct: {
        name: string;
        description: string;
        image: string;
        price: number | null;
        stockQuantity: number | null;
        discount: number | null;
        categoryID: number | null;
    } = {
            name: "",
            description: "",
            image: "",
            price: null,
            stockQuantity: null,
            discount: null,
            categoryID: null,
        };

    editingProductID: number | null = null;
    editingProductName: string = "";
    editingProductDescription: string = "";
    editingProductImage: string = "";
    editingProductPrice: number | null = null;
    editingProductStockQuantity: number | null = null;
    editingProductDiscount: number | null = null;
    editingProductCategoryID: number | null = null;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategoryValues();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private loadProducts(): void {
        this.productsService.getFilteredProducts(
            this.currentPage,
            this.pageSize,
            this.filterCategoryID,
            null,
            null,
            null,
            this.searchName && this.searchName.trim() !== "" ? this.searchName : null,
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
                        this.totalRecords = response.total_records;
                        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                        this.generatePageArray();
                    } else if (response) {
                        this.products = [];
                        this.totalRecords = 0;
                        this.totalPages = 0;
                        this.pages = [];
                    }
                },
                error: (error: any) => {
                    this.products = [];
                    this.totalRecords = 0;
                    this.totalPages = 0;
                    this.pages = [];
                    this.showNotification("error", "Lỗi", "Không thể tải được thông tin sản phẩm.");
                },
            });
    }

    filterProducts(): void {
        this.currentPage = 1;
        this.loadProducts();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadProducts();
        } else if (this.totalPages > 5 && this.pages.slice(-1)[0] < this.totalPages) {
            this.generatePageArray();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
        } else if (this.totalPages > 5 && this.pages[0] > 1) {
            this.generatePageArray();
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

    downloadProductInfo(): void {
        const data = this.products.map(product => ({
            "Mã sản phẩm": product.id,
            "Tên sản phẩm": product.name,
            "Giá bán": product.price,
            "Giảm giá": product.discount,
            "Tồn kho": product.stockQuantity,
            "Mô tả": product.description,
            "Hình ảnh": `https://raw.githubusercontent.com/vtrnguyen/hosting-image-file/refs/heads/main/oribuyin/products/${product.image}`,
            "Danh mục sản phẩm": this.getCategoryName(product.categoryID),
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "OriBuyin's Product");

        XLSX.writeFile(wb, "san_pham_duoc_ban_tai_oribuyin.xlsx");
    }

    toggleActionsMenu(product: Product, button: any): void {
        if (this.selectedProduct === product) {
            this.isActionsMenuOpen = !this.isActionsMenuOpen;
        } else {
            this.selectedProduct = product;
            this.isActionsMenuOpen = true;
        }

        this.actionsMenuButton = button;
    }

    closeActionMenu(): void {
        this.isActionsMenuOpen = false;
        this.selectedProduct = null;
    }

    openAddProductModal(): void {
        this.isAddProductModalOpen = true;
    }

    closeAddProductModal(): void {
        this.resetAddingForm();
        this.isAddProductModalOpen = false;
    }

    openViewProductModal(product: Product): void {
        this.closeActionMenu();
        this.selectedProduct = product;
        this.isViewProductModalOpen = true;
    }

    closeViewProductModal(): void {
        this.selectedProduct = null;
        this.isViewProductModalOpen = false;
    }

    openEditProductModal(product: Product): void {
        this.editingProductID = product.id;
        this.editingProductName = product.name;
        this.editingProductDescription = product.description;
        this.editingProductImage = product.image;
        this.editingProductPrice = product.price;
        this.editingProductStockQuantity = product.stockQuantity;
        this.editingProductDiscount = product.discount;
        this.editingProductCategoryID = product.categoryID;
        this.isEditProductModalOpen = true;
        this.closeActionMenu();
    }

    closeEditProductModal(): void {
        this.resetUpdatingForm();
        this.isEditProductModalOpen = false;
    }

    openDeleteProductModal(product: Product): void {
        this.selectedProduct = product;
        this.closeActionMenu();
        this.isDeleteProductModalOpen = true;
    }

    closeDeleteProductModal(): void {
        this.selectedProduct = null;
        this.isDeleteProductModalOpen = false;
    }

    addProduct(): void {
        if (!this.newProduct || !this.newProduct.name || !this.newProduct.description
            || !this.newProduct.price || !this.newProduct.stockQuantity
            || !this.newProduct.discount || !this.newProduct.categoryID
        ) {
            this.showNotification("warning", "Thông báo", "Không được để trống thông tin");
            return;
        }

        if (this.newProduct.price < 0) {
            this.showNotification("warning", "Thông báo", "Giá không được nhỏ hơn 0");
            return;
        }

        if (this.newProduct.stockQuantity < 0) {
            this.showNotification("warning", "Thông báo", "Số lượng tồn kho không được nhỏ hơn 0")
            return;
        }

        if (this.newProduct.discount < 0) {
            this.showNotification("warning", "Thông báo", "Phần trăm giảm giá không được nhỏ hơn 0")
            return;
        }

        const newProductInfo = {
            name: this.newProduct.name,
            description: this.newProduct.description,
            discount: this.newProduct.discount,
            stock_quantity: this.newProduct.stockQuantity,
            image: this.newProduct.image,
            price: this.newProduct.price,
            category_id: this.newProduct.categoryID,
        }

        this.productsService.createProduct(newProductInfo).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.loadProducts(); // Load lại sản phẩm sau khi thêm
                    this.closeAddProductModal();
                    this.showNotification("success", "Thành công", "Tạo mới sản phẩm thành công");
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Tạo mới sản phẩm không thành công");
            },
        });
    }

    updateProduct(): void {
        if (this.editingProductID === null) {
            this.showNotification("warning", "Thông báo", "Không có sản phẩm nào được chọn để cập nhật");
            return;
        }

        if (!this.editingProductName ||
            this.editingProductPrice === null ||
            this.editingProductStockQuantity === null ||
            this.editingProductDiscount === null ||
            this.editingProductCategoryID === null ||
            !this.editingProductDescription
        ) {
            this.showNotification('error', 'Lỗi', 'Vui lòng điền đầy đủ thông tin sản phẩm');
            return;
        }

        const updatedProduct = {
            id: this.editingProductID,
            name: this.editingProductName,
            description: this.editingProductDescription,
            image: this.editingProductImage,
            price: this.editingProductPrice,
            stock_quantity: this.editingProductStockQuantity,
            discount: this.editingProductDiscount,
            category_id: this.editingProductCategoryID,
        };

        this.productsService.updateProduct(this.editingProductID, updatedProduct).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.showNotification('success', 'Thành công', 'Cập nhật sản phẩm thành công');
                    this.closeEditProductModal();
                    this.loadProducts();
                }
            },
            error: (error: any) => {
                this.showNotification('error', 'Lỗi', 'Lỗi khi cập nhật sản phẩm');
            }
        })
    }

    deleteProduct(): void {
        if (!this.selectedProduct || !this.selectedProduct.id) {
            this.showNotification("warning", "Thông báo", "Không có sản phẩm nào được chọn để xóa");
            return;
        }

        this.productsService.deleteProduct(this.selectedProduct.id).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.loadProducts(); // Load lại sản phẩm sau khi xóa
                    this.showNotification("success", "Thành công", `Đã xóa sản phẩm ${this.selectedProduct?.name}`);
                    this.closeDeleteProductModal();
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", `Không thể xóa sản phẩm ${this.selectedProduct?.name}`);
            },
        });
    }

    getCategoryName(categoryID: number | null): string {
        if (categoryID && this.categoryValues) {
            const category = this.categoryValues.find(cat => cat.id === categoryID);
            return category ? category.name : 'Không xác định';
        }
        return 'Không xác định';
    }

    private resetAddingForm(): void {
        this.newProduct.name = "";
        this.newProduct.description = "";
        this.newProduct.image = "";
        this.newProduct.price = null;
        this.newProduct.stockQuantity = null;
        this.newProduct.discount = null;
        this.newProduct.categoryID = null;
    }

    private resetUpdatingForm(): void {
        this.editingProductID = null;
        this.editingProductName = "";
        this.editingProductDescription = "";
        this.editingProductImage = "";
        this.editingProductPrice = null;
        this.editingProductStockQuantity = null;
        this.editingProductDiscount = null;
        this.editingProductCategoryID = null;
    }

    private loadCategoryValues(): void {
        this.categoriesService.getCategoryValue().subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.categoryValues = response.data;
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Không thể tải danh sách danh mục sản phẩm");
            },
        });
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