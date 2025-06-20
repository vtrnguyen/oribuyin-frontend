import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product } from "../../shared/interfaces/product.interface";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ProductsService {
    private productApiUrl = "http://localhost:3000/api/v1/products";
    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.productApiUrl}`).pipe(
            tap(products => this.productsSubject.next(products)),
        );
    }

    getProductByID(productID: number): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/${productID}`);
    }

    getNumberOfProducts(): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/count`);
    }

    getSuggestedProducts(): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/suggested`);
    }

    getPaginationProducts(page: number, pageSize: number): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/pagination?page=${page}&pageSize=${pageSize}`);
    }

    getProductsByCategoryID(categoryID: number, page: number, pageSize: number): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/categories/${categoryID}?page=${page}&pageSize=${pageSize}`);
    }

    getFilteredProducts(
        page: number,
        pageSize: number,
        categoryID?: number | null,
        minPrice?: number | null,
        maxPrice?: number | null,
        rating?: number | null,
        searchName?: string | null
    ): Observable<any> {
        let params = new HttpParams()
            .set("page", page.toString())
            .set("pageSize", pageSize.toString());

        if (categoryID !== null && categoryID !== undefined) {
            params = params.set("categoryID", categoryID.toString());
        }

        if (minPrice !== null && minPrice !== undefined) {
            params = params.set("minPrice", minPrice.toString());
        }

        if (maxPrice !== null && maxPrice !== undefined) {
            params = params.set("maxPrice", maxPrice.toString());
        }

        if (rating !== null && rating !== undefined) {
            params = params.set("rating", rating.toString());
        }

        if (searchName && searchName.trim() !== "") {
            params = params.set("searchName", searchName.trim());
        }

        return this.http.get<any>(`${this.productApiUrl}/filtered/pagination`, { params });
    }

    getCheckoutProducts(itemIDs: number[]): Observable<any> {
        return this.http.post(`${this.productApiUrl}/checkout`, { itemIDs: itemIDs });
    }

    searchProductsByName(keyword: string): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/search?keyword=${keyword}`);
    }

    createProduct(newProduct: any): Observable<any> {
        return this.http.post<any>(`${this.productApiUrl}`, { newProduct });
    }

    updateProduct(productID: number, updatingProduct: any): Observable<any> {
        return this.http.put<any>(`${this.productApiUrl}/${productID}`, { updatingProduct });
    }

    updateProductStock(productID: number, stockQuantity: number): Observable<any> {
        return this.http.put<any>(`${this.productApiUrl}/stocks/${productID}`, { stockQuantity });
    }

    bulkUpdateProductStock(productsToUpdate: { id: number, stockQuantity: number }[]) {
        return this.http.put<any>(`${this.productApiUrl}/stocks/bulk`, productsToUpdate);
    }

    deleteProduct(productID: number): Observable<any> {
        return this.http.delete<any>(`${this.productApiUrl}/${productID}`);
    }
}
