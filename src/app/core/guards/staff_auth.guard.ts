import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const StaffAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    router.navigate(["/login"]);
    return false;
  }

  if (role !== "staff" && role === "admin") {
    router.navigate(["/admin"]);
  }

  if (role != "staff" && role === "customer") {
    router.navigate(["/"]);
  }

  return true;
};
