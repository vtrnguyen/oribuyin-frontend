import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-auth-login",
    imports: [FormsModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    loginData = {
        email: "",
        password: "",
    };

    passwordVisible: boolean = false;

    constructor(
    ) {}

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        const passwordField = document.getElementById("password") as HTMLInputElement;
        passwordField.type = this.passwordVisible ? "text" : "password";
    }

    onSubmit(): void {
        console.log(this.loginData);
    }
}
