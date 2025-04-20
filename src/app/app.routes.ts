import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: "login", component: LoginComponent, title: "Đăng nhập" },
    { path: "register", component: RegisterComponent, title: "Đăng ký tài khoản" },
];
