import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CustomerLayoutComponent } from './layouts/customer/customer_layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin_layout.component';
import { StaffLayoutComponent } from './layouts/staff/staff_layout.component';

import { UserHomeComponent } from './pages/customer/home/home.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { StaffDashboardComponent } from './pages/staff/dashboard/dashboard.component';
import { PageNotFoundComponent } from './pages/errors/page_not_found.component';
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
            { path: "", component: AdminDashboardComponent },
        ]
    },

    // staff
    {
        path: "staff",
        component: StaffLayoutComponent,
        canActivate: [StaffAuthGuard],
        children: [
            { path: "", component: StaffDashboardComponent },
        ]
    },

    // page not found
    { path: "page-not-found", component: PageNotFoundComponent },
    { path: "**", redirectTo: "page-not-found" },
];
