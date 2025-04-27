import { Component, OnInit } from "@angular/core";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { CommonModule } from "@angular/common";
import { Category } from "../../../shared/interfaces/category.interface";
import { CategoriesService } from "../../../core/services/categories.service";
import { FormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { Notification } from "../../../shared/types/notification.type";

@Component({
    selector: "app-admin-categories",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NotificationComponent,
    ],
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"],
})
export class AdminCategoriesComponent implements OnInit {
    categories: Category[] = [];
    filteredCategories: Category[] = [];
    totalCategories: number = 0;
    searchCategoryName: string = '';
    isActionsMenuOpen: boolean = false;
    selectedCategory: Category | null = null;
    actionsMenuButton: any;

    isViewCategoryModalOpen: boolean = false;
    isAddCategoryModalOpen: boolean = false;
    isEditCategoryModalOpen: boolean = false;
    isDeleteCategoryModalOpen: boolean = false;

    // new category
    newCategoryImage: string = "";
    newCategoryName: string = "";
    newCategoryDescription: string = "";

    // update category
    updateCategoryID: number = 0;
    updateCategoryImage: string = "images/default_category.png";
    updateCategoryName: string = "";
    updateCategoryDescription: string = "";

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = '';
    notificationMessage: string = '';

    constructor(private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.loadAllCategories();
    }

    loadAllCategories(): void {
        this.categoriesService.getAllCategories().subscribe((response: any) => {
            this.categories = response.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                image: item.image,
            }));

            this.filterCategories();
            this.totalCategories = this.filteredCategories.length;
        });
    }

    addCategory(): void {
        if (!this.newCategoryName || !this.newCategoryDescription) {
            this.showNotification("warning", "Thông báo", "Không được để trống thông tin!");
            return;
        }

        const newCategory = {
            name: this.newCategoryName,
            description: this.newCategoryDescription,
            image: "images/default_category.png",
        };

        this.categoriesService.createCategory(newCategory).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.loadAllCategories();
                    this.closeAddCategoryModal();
                    this.showNotification('success', 'Thành công', 'Tạo mới danh mục sản phẩm thành công.');
                }
            },
            error: (error: any) => {
                if (error.error?.subcode === 1) {
                    this.showNotification('error', 'Lỗi', 'Tên danh mục sản phẩm đã tồn tại!');
                    return;
                }

                this.showNotification('error', 'Lỗi', 'Tạo mới danh mục sản phẩm không thành công.');
            }
        })
    }

    updateCategory(): void {
        if (!this.updateCategoryName || !this.updateCategoryDescription) {
            this.showNotification("warning", "Thông báo", "Không được để trống thông tin");
            return;
        }

        if (!this.updateCategoryID) {
            this.showNotification("error", "Lỗi", "Không tồn tại danh mục muốn cập nhật");
            return;
        }

        const updatingCategory = {
            name: this.updateCategoryName,
            description: this.updateCategoryDescription,
            image: this.updateCategoryImage,
        };

        this.categoriesService.updateCategory(this.updateCategoryID, updatingCategory).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.loadAllCategories();
                    this.closeEditCategoryModal();
                    this.showNotification("success", "Thành công", "Cập nhật thông tin danh mục sản phẩm thành công");
                }
            },
            error: (error: any) => {
                if (error.error?.subcode === 1) {
                    this.showNotification("error", "Lỗi", "Tên danh mục đã tồn tại!");
                    return;
                }

                this.showNotification("error", "Lỗi", "Cập nhật thông tin danh mục sản phẩm không thành công.");
            },
        });
    }

    deleteCategory(): void {
        if (!this.selectedCategory || !this.selectedCategory.id) {
            this.showNotification("warning", "Cảnh báo", "Không có sản phẩm được chọn để xóa");
            return;
        }

        this.categoriesService.deleteCategory(this.selectedCategory.id).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.loadAllCategories();
                    this.showNotification("success", "Thành công", `Đã xóa danh mục ${this.selectedCategory?.name}`);
                    this.closeDeleteCategoryModal();
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", `Không thể xóa danh mục ${this.selectedCategory?.name}`);
            }
        });
    }

    filterCategories(): void {
        if (!this.searchCategoryName) {
            this.filteredCategories = [...this.categories];
        } else {
            this.filteredCategories = this.categories.filter(category =>
                category.name.toLowerCase().includes(this.searchCategoryName.toLowerCase()),
            );
            this.totalCategories = this.filteredCategories.length;
        }
    }

    openAddCategoryModal(): void {
        this.isAddCategoryModalOpen = true;
    }

    closeAddCategoryModal(): void {
        this.resetAddingForm();
        this.isAddCategoryModalOpen = false;
    }

    openViewCategoryModal(category: Category): void {
        this.closeActionMenu();
        this.selectedCategory = category;
        this.isViewCategoryModalOpen = true;
    }

    closeViewCategoryModal(): void {
        this.selectedCategory = null;
        this.isViewCategoryModalOpen = false;
    }

    openEditCategoryModal(category: Category): void {
        this.closeActionMenu();

        this.updateCategoryID = category.id;
        this.updateCategoryName = category.name;
        this.updateCategoryDescription = category.description;
        this.updateCategoryImage = category.image;

        this.isEditCategoryModalOpen = true;
    }

    closeEditCategoryModal(): void {
        this.resetUpdatingForm();
        this.isEditCategoryModalOpen = false;
    }

    openDeleteCategoryModal(category: Category): void {
        this.closeActionMenu();
        this.selectedCategory = category;
        this.isDeleteCategoryModalOpen = true;
    }

    closeDeleteCategoryModal(): void {
        this.selectedCategory = null;
        this.isDeleteCategoryModalOpen = false;
    }

    toggleActionsMenu(category: Category, button: any): void {
        if (this.selectedCategory === category) {
            this.isActionsMenuOpen = !this.isActionsMenuOpen;
        } else {
            this.selectedCategory = category;
            this.isActionsMenuOpen = true;
        }
        this.actionsMenuButton = button;
    }

    closeActionMenu(): void {
        this.isActionsMenuOpen = false;
        this.selectedCategory = null;
    }

    downloadCategoryInfo(): void {
        console.log('Tải xuống thông tin danh mục');
    }

    showNotification(type: Notification, title: string, message: string): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }

    private resetAddingForm(): void {
        this.newCategoryImage = "";
        this.newCategoryName = "";
        this.newCategoryDescription = "";
    }

    private resetUpdatingForm(): void {
        this.updateCategoryID = 0;
        this.updateCategoryName = "";
        this.updateCategoryDescription = "";
        this.updateCategoryImage = "";
    }
}
