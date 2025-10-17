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

    forgotPassword(identifier: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/forgot-password`, { identifier }));
    }

    verifyOtp(identifier: string, code: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/verify-otp`, { identifier, code }));
    }

    resetPassword(reset_token: string, new_password: string): Promise<any> {
        return lastValueFrom(this.http.post(`${this.authApiUrl}/reset-password`, { reset_token, new_password }));
    }

    signInWithGooglePopup(): Promise<any> {
        return new Promise((resolve, reject) => {
            const popupWidth = 600;
            const popupHeight = 700;
            const left = window.screenX + (window.innerWidth - popupWidth) / 2;
            const top = window.screenY + (window.innerHeight - popupHeight) / 2;

            const url = `${this.authApiUrl}/google?returnTo=${encodeURIComponent(window.location.origin)}`;

            const popup = window.open(url, '_blank', `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);

            if (!popup) return reject(new Error('Popup blocked'));

            const listener = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;
                const data = event.data;
                if (data && data.access_token) {
                    window.removeEventListener('message', listener);
                    try {
                        localStorage.setItem('access_token', data.access_token);
                        if (data.role) localStorage.setItem('role', data.role);
                        if (data.user_id) localStorage.setItem('user_id', data.user_id);
                    } catch (e) {
                    }
                    resolve(data);
                }
            };

            window.addEventListener('message', listener);

            const timeoutId = setTimeout(() => {
                window.removeEventListener('message', listener);
                reject(new Error('Timeout waiting for Google sign-in'));
                try { popup.close(); } catch (e) { }
            }, 120000);
        });
    }
}
