import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private authApiUrl = "http://localhost:3000/api/v1/auth";

    constructor(private http: HttpClient) {}

    login(credentials: { user_name: string; password: string }): Observable<any> {
        return this.http.post(`${this.authApiUrl}/login`, credentials);
    }
}
