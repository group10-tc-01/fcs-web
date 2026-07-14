import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { API_CONFIG } from "@core/config/api.config";
import { SKIP_ERROR_NOTIFICATION } from "@core/interceptors/error.interceptor";
import { AuthService, IAuthenticatedUser, ILoginResponse } from "./auth.service";

describe("AuthService", () => {
  const apiBaseUrl = API_CONFIG.bffBaseUrl;
  const loginResponse: ILoginResponse = {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresIn: 300,
    tokenType: "Bearer",
  };

  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should unwrap a successful donor registration response", () => {
    const request = {
      fullName: "Maria Silva",
      email: "maria@email.com",
      cpf: "12345678909",
      password: "StrongPassword123!",
    };
    const response = {
      id: "donor-id",
      fullName: request.fullName,
      email: request.email,
      cpf: request.cpf,
    };
    let result: typeof response | undefined;

    authService.register(request).subscribe((value) => {
      result = value;
    });

    const httpRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/auth/register/donor`);
    expect(httpRequest.request.method).toBe("POST");
    expect(httpRequest.request.withCredentials).toBe(true);
    expect(httpRequest.request.body).toEqual(request);

    httpRequest.flush(apiResponse(response));

    expect(result).toEqual(response);
  });

  it("should login and then load the current user using fullName", () => {
    let result: IAuthenticatedUser | undefined;

    authService.login({ email: "maria@email.com", password: "secret" }).subscribe((user) => {
      result = user;
    });

    const loginRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/auth/login`);
    expect(loginRequest.request.method).toBe("POST");
    expect(loginRequest.request.withCredentials).toBe(true);
    loginRequest.flush(apiResponse(loginResponse));

    const meRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`);
    expect(meRequest.request.method).toBe("GET");
    expect(meRequest.request.withCredentials).toBe(true);
    meRequest.flush(
      apiResponse({
        id: "user-id",
        keycloakUserId: "keycloak-user-id",
        fullName: "Maria Silva",
        email: "maria@email.com",
        role: "GestorONG",
      }),
    );

    expect(result).toEqual({
      id: "user-id",
      keycloakUserId: "keycloak-user-id",
      name: "Maria Silva",
      email: "maria@email.com",
      role: "GestorONG",
    });
    expect(authService.currentUser()).toEqual(result);
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.isManager()).toBe(true);
  });

  it("should normalize users using nomeCompleto when fullName is missing", () => {
    let result: IAuthenticatedUser | undefined;

    authService.login({ email: "joao@email.com", password: "secret" }).subscribe((user) => {
      result = user;
    });

    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/auth/login`)
      .flush(apiResponse(loginResponse));
    httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`).flush(
      apiResponse({
        id: "user-id",
        keycloakUserId: "keycloak-user-id",
        nomeCompleto: "Joao Silva",
        email: "joao@email.com",
        role: "Doador",
      }),
    );

    expect(result?.name).toBe("Joao Silva");
    expect(result?.role).toBe("Doador");
    expect(authService.isManager()).toBe(false);
  });

  it("should use a fallback user name and donor role when the API returns unknown data", () => {
    let result: IAuthenticatedUser | undefined;

    authService.login({ email: "empty@email.com", password: "secret" }).subscribe((user) => {
      result = user;
    });

    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/auth/login`)
      .flush(apiResponse(loginResponse));
    httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`).flush(apiResponse({}));

    expect(result).toEqual({
      id: "",
      keycloakUserId: "",
      name: "Doador",
      email: "",
      role: "Doador",
    });
  });

  it("should clear the current user on logout even when the backend request fails", () => {
    authenticate();

    authService.logout().subscribe();

    const logoutRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/auth/logout`);
    expect(logoutRequest.request.method).toBe("POST");
    expect(logoutRequest.request.withCredentials).toBe(true);
    logoutRequest.flush("Erro", { status: 500, statusText: "Internal Server Error" });

    expect(authService.currentUser()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it("should return true without HTTP calls when the user is already authenticated", () => {
    authenticate();

    let result: boolean | undefined;
    authService.ensureAuthenticated().subscribe((value) => {
      result = value;
    });

    httpTestingController.expectNone(`${apiBaseUrl}/api/v1/me`);
    httpTestingController.expectNone(`${apiBaseUrl}/api/v1/auth/refresh`);
    expect(result).toBe(true);
  });

  it("should refresh the session silently when the current user request fails", () => {
    let result: boolean | undefined;

    authService.ensureAuthenticated().subscribe((value) => {
      result = value;
    });

    const firstMeRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`);
    expect(firstMeRequest.request.withCredentials).toBe(true);
    expect(firstMeRequest.request.context.get(SKIP_ERROR_NOTIFICATION)).toBe(true);
    firstMeRequest.flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    const refreshRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/auth/refresh`);
    expect(refreshRequest.request.withCredentials).toBe(true);
    expect(refreshRequest.request.context.get(SKIP_ERROR_NOTIFICATION)).toBe(true);
    expect(refreshRequest.request.body).toEqual({ refreshToken: "" });
    refreshRequest.flush(apiResponse(loginResponse));

    const secondMeRequest = httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`);
    expect(secondMeRequest.request.context.get(SKIP_ERROR_NOTIFICATION)).toBe(true);
    secondMeRequest.flush(
      apiResponse({
        id: "user-id",
        keycloakUserId: "keycloak-user-id",
        fullName: "Maria Silva",
        email: "maria@email.com",
        role: "Doador",
      }),
    );

    expect(result).toBe(true);
    expect(authService.currentUser()?.name).toBe("Maria Silva");
  });

  it("should return false when current user and refresh requests fail", () => {
    let result: boolean | undefined;

    authService.ensureAuthenticated().subscribe((value) => {
      result = value;
    });

    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/me`)
      .flush("Unauthorized", { status: 401, statusText: "Unauthorized" });
    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/auth/refresh`)
      .flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    expect(result).toBe(false);
    expect(authService.currentUser()).toBeNull();
  });

  it("should throw when an API response envelope is unsuccessful", () => {
    let error: Error | undefined;

    authService
      .register({
        fullName: "Maria Silva",
        email: "maria@email.com",
        cpf: "12345678909",
        password: "StrongPassword123!",
      })
      .subscribe({
        error: (value: Error) => {
          error = value;
        },
      });

    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/auth/register/donor`)
      .flush({ success: false, data: null, message: "Envelope failure." });

    expect(error?.message).toBe("Envelope failure.");
  });

  function authenticate(): void {
    authService.login({ email: "maria@email.com", password: "secret" }).subscribe();
    httpTestingController
      .expectOne(`${apiBaseUrl}/api/v1/auth/login`)
      .flush(apiResponse(loginResponse));
    httpTestingController.expectOne(`${apiBaseUrl}/api/v1/me`).flush(
      apiResponse({
        id: "user-id",
        keycloakUserId: "keycloak-user-id",
        fullName: "Maria Silva",
        email: "maria@email.com",
        role: "Doador",
      }),
    );
  }

  function apiResponse<T>(data: T): { success: true; data: T; message: null } {
    return {
      success: true,
      data,
      message: null,
    };
  }
});
