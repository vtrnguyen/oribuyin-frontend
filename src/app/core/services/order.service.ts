import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CreateOrderDto } from "../../shared/dtos/create_order.dto";

@Injectable({
    providedIn: "root",
})
export class OrderService {
    private orderApiUrl = "http://localhost:3000/api/v1/orders";

    constructor(private http: HttpClient) { }

    createOrder(order: CreateOrderDto): Observable<any> {
        return this.http.post<any>(`${this.orderApiUrl}`, order);
    }
}
