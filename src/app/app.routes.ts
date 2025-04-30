import { Routes } from '@angular/router';

// Layouts
import { AdminLayoutComponent } from './layouts/admin/admin_layout.component';
import { StaffLayoutComponent } from './layouts/staff/staff_layout.component';
import { CustomerLayoutComponent } from './layouts/customer/customer_layout.component';

// Auth components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Admin components
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminCategoriesComponent } from './pages/admin/categories/categories.component';
import { AdminProductsComponent } from './pages/admin/products/products.component';
import { AdminReportsComponent } from './pages/admin/reports/reports.component';
import { AdminSettingsComponent } from './pages/admin/settings/settings.component';
import { AdminUsersComponent } from './pages/admin/users/users.component';
import { AdminOrdersComponent } from './pages/admin/orders/orders.component';
import { AdminProfileComponent } from './pages/admin/profile/profile.component';

// Staff components
import { StaffDashboardComponent } from './pages/staff/dashboard/dashboard.component';
import { StaffStocksComponent } from './pages/staff/stocks/stocks.component';
import { StaffOrdersComponent } from './pages/staff/orders/orders.component';
import { StaffReportsComponent } from './pages/staff/reports/reports.component';
import { StaffProfileComponent } from './pages/staff/profile/profile.component';
import { StaffSettingsComponent } from './pages/staff/settings/settings.component';

// User components
import { UserHomeComponent } from './pages/customer/home/home.component';

// Error components
import { PageNotFoundComponent } from './pages/errors/page_not_found.component';

// Guards
import { AdminAuthGuard } from './core/guards/admin_auth.guard';
import { CustomerAuthGuard } from './core/guards/customer_auth.guard';
import { StaffAuthGuard } from './core/guards/staff_auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    { 
        path: "login",
        component: LoginComponent,
        canActivate: [AuthenticatedGuard],
    },
    { 
        path: "register", 
        component: RegisterComponent,
        canActivate: [AuthenticatedGuard],
    },
    
    // customer
    { 
        path: "",
        component: CustomerLayoutComponent,
        canActivate: [CustomerAuthGuard],
        children: [
            { path: "", component: UserHomeComponent },
        ],
    },
    
    // admin
    {
        path: "admin",
        component: AdminLayoutComponent,
        canActivate: [AdminAuthGuard],
        children: [
            { path: "", component: AdminDashboardComponent, title: "Thông tin chung" },
            { path: "dashboard", redirectTo: "", pathMatch: 'full' },
            { path: "users", component: AdminUsersComponent, title: "Người dùng" },
            { path: "categories", component: AdminCategoriesComponent, title: "Danh mục sản phẩm" },
            { path: "products", component: AdminProductsComponent, title: "Sản phẩm" },
            { path: "orders", component: AdminOrdersComponent, title: "Đơn hàng" },
            { path: "reports", component: AdminReportsComponent, title: "Báo cáo" },
            { path: "profile", component: AdminProfileComponent, title: "Thông tin cá nhân" },
            { path: "settings", component: AdminSettingsComponent, title: "Cài đặt" },
        ]
    },

    // staff
    {
        path: "staff",
        component: StaffLayoutComponent,
        canActivate: [StaffAuthGuard],
        children: [
            { path: "", component: StaffDashboardComponent, title: "Thông tin chung" },
            { path: "dashboard", redirectTo: "", pathMatch: 'full' },
            { path: "stocks", component: StaffStocksComponent, title: "Nhập kho" },
            { path: "orders", component: StaffOrdersComponent, title: "Đơn hàng" },
            { path: "reports", component: StaffReportsComponent, title: "Báo cáo" },
            { path: "profile", component: StaffProfileComponent, title: "Thông tin cá nhân" },
            { path: "settings", component: StaffSettingsComponent, title: "Cài đặt" },
        ]
    },

    // page not found
    { path: "page-not-found", component: PageNotFoundComponent },
    { path: "**", redirectTo: "page-not-found" },
];
