import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (accessToken && role) {
    if (role === "admin") router.navigate(['/admin']);

    if (role === "staff") router.navigate(["/staff"]);

    if (role === "customer") router.navigate(["/"]);

    return false;
  }

  return true;
};
