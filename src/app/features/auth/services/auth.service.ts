import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { Observable, catchError, map, of, switchMap, tap } from "rxjs";

import { API_CONFIG } from "@core/config/api.config";
import { SKIP_ERROR_NOTIFICATION } from "@core/interceptors/error.interceptor";

export interface IRegisterRequest {
  fullName: string;
  email: string;
  cpf: string;
  password: string;
}

export interface IRegisterResponse {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export type AuthRole = "Doador" | "GestorONG";

export interface IAuthenticatedUser {
  id: string;
  keycloakUserId: string;
  name: string;
  email: string;
  role: AuthRole;
}

interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly user = signal<IAuthenticatedUser | null>(null);

  readonly currentUser = computed(() => this.user());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isManager = computed(() => this.currentUser()?.role === "GestorONG");

  register(request: IRegisterRequest): Observable<IRegisterResponse> {
    return this.httpClient
      .post<
        IApiResponse<IRegisterResponse>
      >(`${API_CONFIG.identityBaseUrl}/api/v1/auth/register/donor`, request, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  login(request: ILoginRequest): Observable<IAuthenticatedUser> {
    return this.httpClient
      .post<
        IApiResponse<ILoginResponse>
      >(`${API_CONFIG.identityBaseUrl}/api/v1/auth/login`, request, this.createCredentialRequestOptions(true))
      .pipe(
        map((response) => this.unwrapResponse(response)),
        switchMap(() => this.loadCurrentUser(true)),
      );
  }

  logout(): Observable<void> {
    return this.httpClient
      .post<void>(`${API_CONFIG.identityBaseUrl}/api/v1/auth/logout`, null, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => of(undefined)),
        tap(() => this.user.set(null)),
      );
  }

  ensureAuthenticated(): Observable<boolean> {
    if (this.isAuthenticated()) {
      return of(true);
    }

    return this.loadCurrentUser(true).pipe(
      map(() => true),
      catchError(() =>
        this.refreshSession(true).pipe(
          switchMap(() => this.loadCurrentUser(true)),
          map(() => true),
          catchError(() => of(false)),
        ),
      ),
    );
  }

  private refreshSession(silent = false): Observable<ILoginResponse> {
    return this.httpClient
      .post<
        IApiResponse<ILoginResponse>
      >(`${API_CONFIG.identityBaseUrl}/api/v1/auth/refresh`, { refreshToken: "" }, this.createCredentialRequestOptions(silent))
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  private loadCurrentUser(silent = false): Observable<IAuthenticatedUser> {
    return this.httpClient
      .get<
        IApiResponse<unknown>
      >(`${API_CONFIG.identityBaseUrl}/api/v1/me`, this.createCredentialRequestOptions(silent))
      .pipe(
        map((response) => this.normalizeUser(this.unwrapResponse(response))),
        tap((user) => this.user.set(user)),
      );
  }

  private createCredentialRequestOptions(silent: boolean): {
    withCredentials: true;
    context?: HttpContext;
  } {
    if (!silent) {
      return { withCredentials: true };
    }

    return {
      withCredentials: true,
      context: new HttpContext().set(SKIP_ERROR_NOTIFICATION, true),
    };
  }

  private normalizeUser(user: unknown): IAuthenticatedUser {
    const source = isRecord(user) ? user : {};
    const rawRole = source["role"];

    return {
      id: stringValue(source["id"]),
      keycloakUserId: stringValue(source["keycloakUserId"]),
      name: stringValue(source["fullName"]) || stringValue(source["nomeCompleto"]) || "Doador",
      email: stringValue(source["email"]),
      role: rawRole === "GestorONG" ? "GestorONG" : "Doador",
    };
  }

  private unwrapResponse<T>(response: IApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message ?? "Unexpected API response.");
    }

    return response.data;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
