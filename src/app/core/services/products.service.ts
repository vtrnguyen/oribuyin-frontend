import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product } from "../../shared/interfaces/product.interface";
import { HttpClient } from "@angular/common/http";

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

    getNumberOfProducts(): Observable<any> {
        return this.http.get<any>(`${this.productApiUrl}/count`);
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
