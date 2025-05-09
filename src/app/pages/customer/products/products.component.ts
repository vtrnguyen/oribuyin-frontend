import { Component, OnInit } from "@angular/core";
import { Product } from "../../../shared/interfaces/product.interface";
import { Category } from "../../../shared/interfaces/category.interface";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-customer-products",
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class CustomerProductsComponent implements OnInit {
    mockProducts: Product[] = [];
    mockCategories: Category[] = [];

    ngOnInit(): void {
        this.loadMockData();
    }

    loadMockData(): void {
        this.mockCategories = [
            { id: 1, name: "Điện tử", description: "Các sản phẩm điện tử tiêu dùng", image: "https://via.placeholder.com/50/008080/FFFFFF?Text=Electronics" },
            { id: 2, name: "Quần áo & Thời trang", description: "Trang phục, giày dép và phụ kiện thời trang", image: "https://via.placeholder.com/50/FFA07A/FFFFFF?Text=Fashion" },
            { id: 3, name: "Nhà cửa & Đời sống", description: "Đồ dùng gia đình, nội thất và trang trí", image: "https://via.placeholder.com/50/8FBC8F/FFFFFF?Text=Home" },
            { id: 4, name: "Sức khỏe & Làm đẹp", description: "Sản phẩm chăm sóc sức khỏe và sắc đẹp", image: "https://via.placeholder.com/50/FFDAB9/000000?Text=Beauty" },
            { id: 5, name: "Thể thao & Dã ngoại", description: "Dụng cụ và trang phục thể thao, đồ dùng dã ngoại", image: "https://via.placeholder.com/50/ADD8E6/000000?Text=Sports" },
            { id: 6, name: "Sách & Văn phòng phẩm", description: "Sách các loại và đồ dùng văn phòng", image: "https://via.placeholder.com/50/F0E68C/000000?Text=Books" },
        ];

        this.mockProducts = [
            { id: 1, name: "Sản phẩm 1", description: "Mô tả sản phẩm 1", price: 100, discount: 10, stockQuantity: 10, image: "https://via.placeholder.com/200/FF0000", categoryID: 1 },
            { id: 2, name: "Sản phẩm 2", description: "Mô tả sản phẩm 2", price: 200, discount: 20, stockQuantity: 20, image: "https://via.placeholder.com/200/00FF00", categoryID: 2 },
            { id: 3, name: "Sản phẩm 3", description: "Mô tả sản phẩm 3", price: 150, discount: 0, stockQuantity: 15, image: "https://via.placeholder.com/200/0000FF", categoryID: 1 },
            { id: 4, name: "Sản phẩm 4", description: "Mô tả sản phẩm 4", price: 300, discount: 5, stockQuantity: 30, image: "https://via.placeholder.com/200/FFFF00", categoryID: 3 },
        ];
    }

    getCategoryProductCountMock(categoryId: number): number {
        return this.mockProducts.filter(product => product.categoryID === categoryId).length;
    }
}