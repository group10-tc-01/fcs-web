import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@features/auth/services/auth.service";
import { map } from "rxjs";

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .ensureAuthenticated()
    .pipe(
      map((isAuthenticated) => (isAuthenticated ? router.createUrlTree(["/dashboard"]) : true)),
    );
};
