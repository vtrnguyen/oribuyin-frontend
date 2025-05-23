import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class CartStateManagerService {
    updateCartItemQuantity$ = new Subject<void>();

    constructor() { }
}