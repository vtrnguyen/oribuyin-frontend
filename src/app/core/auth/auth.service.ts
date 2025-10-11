import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private authApiUrl = "http://localhost:3000/api/v1/auth";

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: { user_name: string; password: string }): Observable<any> {
        return this.http.post(`${this.authApiUrl}/login`, credentials);
    }

    register(credentials: {
        user_name: string;
        password: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    }): Observable<any> {
        return this.http.post(`${this.authApiUrl}/register`, credentials);
    }

    logout(): Observable<any> {
        return this.http.post(`${this.authApiUrl}/logout`, {});
    }

    clearLocalStorageAndRedirect(): void {
        localStorage.clear();
        this.router.navigate(["/login"]);
    }

    // Forgot-password flow endpoints
    // request OTP (identifier = email or username)
    forgotPassword(identifier: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/forgot-password`, { identifier }));
    }

    // verify OTP -> returns reset_token
    verifyOtp(identifier: string, code: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/verify-otp`, { identifier, code }));
    }

    // reset password using reset_token
    resetPassword(reset_token: string, new_password: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/reset-password`, { reset_token, new_password }));
    }
}
