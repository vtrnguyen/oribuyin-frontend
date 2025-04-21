import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService)

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            const authRequest = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
            });
            return next.handle(authRequest);
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    this.authService.clearLocalStorageAndRedirect();
                    return throwError(() => error);
                }

                return throwError(() => error);
            })
        )
    }
}
