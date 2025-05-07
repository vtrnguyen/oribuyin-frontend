import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CartItem } from "../../shared/interfaces/cart_item.interface";

@Injectable({
    providedIn: "root",
})
export class CartService {
    private cartApiUrl = "http://localhost:3000/api/v1/cart";
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) { }

    getCartItem(userID: number): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`${this.cartApiUrl}/${userID}`).pipe(
            tap(cartItem => this.cartSubject.next(cartItem)),
        );
    }

    getNumberOfCartProduct(userID: number): Observable<number> {
        return this.http.get<number>(`${this.cartApiUrl}/count/${userID}`);
    }

    addProductToCart(userID: number, productID: number, quantity: number): Observable<any> {
        return this.http.post<any>(`${this.cartApiUrl}`, { userID, productID, quantity });
    }

    updateCartItemQuantity(cartItemID: number, quantity: number): Observable<any> {
        return this.http.put<any>(`${this.cartApiUrl}/${cartItemID}`, { quantity: quantity });
    }

    deleteCartItem(cartItemID: number): Observable<any> {
        return this.http.delete<any>(`${this.cartApiUrl}/${cartItemID}`);
    }
}
