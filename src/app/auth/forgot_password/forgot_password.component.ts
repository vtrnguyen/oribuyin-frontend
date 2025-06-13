import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-auth-forgot-password",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: "./forgot_password.component.html",
  styleUrls: ["./forgot_password.component.scss"]
})
export class ForgotPasswordComponent {
  // Define a data model for the form
  forgotPasswordData = {
    identifier: '' // This will hold either email or username
  };

  errorMessage: string | null = null; // To display error messages

  constructor() { }

  // Method to handle form submission
  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Forgot password request submitted:', this.forgotPasswordData);
      // In a real application, you would send this data to your backend API
      // Example: this.authService.requestPasswordReset(this.forgotPasswordData.identifier).subscribe({
      //   next: (response) => {
      //     this.errorMessage = 'Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn.';
      //     // Redirect to a success page or show a success message
      //   },
      //   error: (err) => {
      //     this.errorMessage = err.error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      //   }
      // });

      // For demonstration, simulate a success or error
      if (this.forgotPasswordData.identifier.includes('@')) {
        this.errorMessage = 'Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.';
      } else {
        this.errorMessage = 'Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.';
      }
      // Clear the form after submission (optional)
      // form.resetForm();

    } else {
      this.errorMessage = 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ.';
    }
  }
}
