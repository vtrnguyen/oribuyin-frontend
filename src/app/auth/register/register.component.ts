import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/auth/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-auth-register",
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
    registerData = {
        user_name: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    };

    confirmPassword: string = "";
    errorMessage: string = "";
    successMessage: string = "";
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    onSubmit(): void {
        this.errorMessage = "";

        const { user_name, password, first_name, last_name, email, phone_number } = this.registerData;
        if (!user_name || !password || !first_name || !last_name || !email || !phone_number) {
            this.errorMessage = "Vui lòng nhập đầy đủ thông tin.";
            return;
        }

        if (password !== this.confirmPassword) {
            this.errorMessage = "Mật khẩu và xác nhận mật khẩu không khớp.";
            return;
        }

        this.loading = true;

        this.authService.register(this.registerData).subscribe({
            next: (res: any) => {
                this.successMessage = res?.message || "Đăng ký thành công";

                this.authService.login({ user_name: this.registerData.user_name, password: this.registerData.password }).subscribe({
                    next: (loginRes: any) => {
                        try {
                            localStorage.setItem("access_token", loginRes.access_token);
                            localStorage.setItem("user_id", loginRes.user_id);
                            localStorage.setItem("role", loginRes.account.role);

                            this.router.navigate(["/"]);
                            return;
                        } finally {
                            this.loading = false;
                        }
                    },
                    error: (loginErr: any) => {
                        this.loading = false;
                        this.errorMessage = loginErr?.error?.message || loginErr?.message || "Đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.";
                        this.router.navigate(["/login"]);
                    }
                });
            },
            error: (err: any) => {
                this.loading = false;
                this.errorMessage = err?.error?.message || err?.message || "Đăng ký thất bại.";
            }
        });
    }
}
