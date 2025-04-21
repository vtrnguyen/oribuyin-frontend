import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const AdminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    router.navigate(["/login"]);
    return false;
  }

  if (role !== "admin" && role === "staff") {
    router.navigate(["/staff"]);
  }

  if (role != "admin" && role === "customer") {
    router.navigate(["/"]);
  }

  return true;
};
