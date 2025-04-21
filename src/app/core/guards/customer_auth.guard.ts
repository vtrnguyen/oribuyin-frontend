import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const CustomerAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    router.navigate(["/login"]);
    return false;
  }

  if (role != "customer" && role === "admin") {
    router.navigate(["/admin"]);
  }

  if (role !== "customer" && role === "staff") {
    router.navigate(["/staff"]);
  }

  return true;
};
