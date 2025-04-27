import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../../shared/interfaces/product.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ProductsService {
    private productApiUrl = "http://localhost:3000/api/v1/products";
    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) {}
}
