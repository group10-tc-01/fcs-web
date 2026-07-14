import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";

import { AuthService } from "@features/auth/services/auth.service";

export const managerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .ensureAuthenticated()
    .pipe(
      map((isAuthenticated) =>
        isAuthenticated && authService.isManager() ? true : router.createUrlTree(["/dashboard"]),
      ),
    );
};
