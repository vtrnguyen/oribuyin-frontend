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

    getAllOrders(): Observable<any> {
        return this.http.get<any>(`${this.orderApiUrl}`);
    }

    getRecentOrders(): Observable<any> {
        return this.http.get<any>(`${this.orderApiUrl}/recent`);
    }

    getOrdersByUserId(userId: number): Observable<any> {
        return this.http.get<any>(`${this.orderApiUrl}/${userId}`);
    }

    getCurrentMonthRevenue(): Observable<any> {
        return this.http.get<any>(`${this.orderApiUrl}/current-month-revenue`);
    }

    getOrdersByTimeRange(
        range: string,
        custom_start?: string,
        custom_end?: string
    ): Observable<any> {
        let params: any = { range };

        if (range === "custom" && custom_start && custom_end) {
            params.custom_start = custom_start;
            params.custom_end = custom_end;
        }

        return this.http.get<any>(`${this.orderApiUrl}/by-time-range`, { params });
    }

    createOrder(order: CreateOrderDto): Observable<any> {
        return this.http.post<any>(`${this.orderApiUrl}`, order);
    }

    updateOrder(orderID: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.orderApiUrl}/${orderID}/status`, { status });
    }
}
