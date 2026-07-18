import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

import { API_CONFIG } from "@core/config/api.config";
import { AuthService } from "@features/auth/services/auth.service";

const anonymousPaths = [
  "/api/v1/auth/login",
  "/api/v1/auth/register/donor",
  "/api/v1/auth/refresh",
];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();
  const isBffRequest = request.url.startsWith(API_CONFIG.bffBaseUrl);
  const isAnonymousRequest = anonymousPaths.some((path) => request.url.endsWith(path));

  if (!token || !isBffRequest || isAnonymousRequest) {
    return next(request);
  }

  const authenticatedRequest = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken(true).pipe(
        switchMap((response) =>
          next(request.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } })),
        ),
        catchError((refreshError: unknown) => throwError(() => refreshError)),
      );
    }),
  );
};
