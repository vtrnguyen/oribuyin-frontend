import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/auth/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-auth-login",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  loginData = {
    user_name: "",
    password: "",
  };

  passwordVisible: boolean = false;
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (!this.loginData.user_name || !this.loginData.password) {
      this.errorMessage = "Vui lòng nhập đầy đủ thông tin.";
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user_id", res.user_id);
        localStorage.setItem("role", res.account.role);

        const role = res.account.role;

        if (role === "admin") {
          this.router.navigate(["/admin"]);
          return;
        }

        if (role === "staff") {
          this.router.navigate(["/staff"]);
          return;
        }

        if (role === "customer") {
          this.router.navigate(["/"]);
          return;
        }
      },
      error: (err) => {
        this.errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      }
    });
  }

  onGoogleSignIn(): void {
    this.authService.signInWithGooglePopup()
      .then(() => {
        const role = localStorage.getItem('role');
        if (role === 'admin') { this.router.navigate(['/admin']); return; }
        if (role === 'staff') { this.router.navigate(['/staff']); return; }
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error('Google sign-in error', err);
        this.errorMessage = 'Đăng nhập bằng Google thất bại.';
      });
  }
}
