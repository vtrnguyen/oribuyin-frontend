import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

type Step = "request" | "verify" | "reset";

@Component({
  standalone: true,
  selector: "app-forgot-password",
  imports: [CommonModule, FormsModule],
  templateUrl: "./forgot_password.component.html",
  styleUrls: ["./forgot_password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  identifier: string = "";
  username: string = "";
  email: string = "";
  code: string = ""; // OTP
  newPassword: string = "";
  confirmPassword: string = "";

  step: Step = "request";
  loading = false;
  message = "";
  error = "";

  // server-issued token after OTP verify
  resetToken: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  private clearAlerts() {
    this.message = "";
    this.error = "";
  }

  async submitRequest() {
    this.clearAlerts();
    if (!this.identifier) {
      this.error = "Vui lòng nhập tên đăng nhập hoặc email";
      return;
    }
    this.loading = true;
    try {
      const res: any = await this.authService.forgotPassword(this.identifier);
      this.message = this.identifier.includes("@") ?
        `OTP đã được gửi đến email ${this.identifier}` :
        `OTP đã được gửi đến email đã đăng ký của tài khoản ${this.identifier}`;
      this.step = "verify";
    } catch (err: any) {
      this.error = "Yêu cầu thất bại";
    } finally {
      this.loading = false;
    }
  }

  async submitVerify() {
    this.clearAlerts();
    if (!this.identifier || !this.code) {
      this.error = "Vui lòng cung cấp tên đăng nhập và OTP";
      return;
    }
    this.loading = true;
    try {
      const res: any = await this.authService.verifyOtp(this.identifier, this.code);
      this.message = "OTP đã được xác nhận";
      this.resetToken = res?.reset_token || null;
      this.step = "reset";
    } catch (err: any) {
      this.error = "Xác thực thất bại";
    } finally {
      this.loading = false;
    }
  }

  async submitReset() {
    this.clearAlerts();
    if (!this.newPassword || !this.confirmPassword) {
      this.error = "Vui lòng nhập và xác nhận mật khẩu mới";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Mật khẩu không khớp";
      return;
    }
    if (!this.resetToken) {
      this.error = "Thiếu mã thông báo đặt lại. Vui lòng xác thực lại OTP";
      this.step = "verify";
      return;
    }

    this.loading = true;
    try {
      const res: any = await this.authService.resetPassword(this.resetToken, this.newPassword);
      this.message = "Mật khẩu đã được đặt lại thành công";
      setTimeout(() => this.router.navigate(["/login"]), 1200);
    } catch (err: any) {
      this.error = err?.error?.message || err?.message || "Đặt lại mật khẩu thất bại";
    } finally {
      this.loading = false;
    }
  }

  backToRequest() {
    this.step = "request";
    this.code = "";
    this.resetToken = null;
    this.clearAlerts();
  }
}
