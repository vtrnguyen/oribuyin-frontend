import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const router = inject(Router);

  if (accessToken && role) {
    if (role === "admin") router.navigate(['/admin']);

    if (role === "staff") router.navigate(["/staff"]);

    if (role === "customer") router.navigate(["/"]);

    return false;
  }

  return true;
};
