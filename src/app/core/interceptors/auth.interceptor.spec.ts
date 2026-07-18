import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { API_CONFIG } from "@core/config/api.config";
import { AuthService, ILoginResponse } from "@features/auth/services/auth.service";
import { of, throwError } from "rxjs";

import { authInterceptor } from "./auth.interceptor";

describe("authInterceptor", () => {
  const refreshedToken: ILoginResponse = {
    accessToken: "refreshed-access-token",
    refreshToken: "refreshed-refresh-token",
    expiresIn: 300,
    tokenType: "Bearer",
  };

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: {
    accessToken: ReturnType<typeof vi.fn>;
    refreshAccessToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authService = {
      accessToken: vi.fn(() => "access-token"),
      refreshAccessToken: vi.fn(() => of(refreshedToken)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should add the bearer token to authenticated BFF requests", () => {
    httpClient.get(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`).subscribe();

    const request = httpTestingController.expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`);
    expect(request.request.headers.get("Authorization")).toBe("Bearer access-token");
    request.flush({});
  });

  it("should not add the bearer token to anonymous or external requests", () => {
    httpClient.post(`${API_CONFIG.bffBaseUrl}/api/v1/auth/login`, {}).subscribe();
    httpClient.get("https://example.test/status").subscribe();

    const loginRequest = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/auth/login`,
    );
    const externalRequest = httpTestingController.expectOne("https://example.test/status");
    expect(loginRequest.request.headers.has("Authorization")).toBe(false);
    expect(externalRequest.request.headers.has("Authorization")).toBe(false);
    loginRequest.flush({});
    externalRequest.flush({});
  });

  it("should refresh the access token and retry a request after an unauthorized response", () => {
    httpClient.get(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`).subscribe();

    httpTestingController
      .expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`)
      .flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    const retriedRequest = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/campaigns`,
    );
    expect(authService.refreshAccessToken).toHaveBeenCalledWith(true);
    expect(retriedRequest.request.headers.get("Authorization")).toBe(
      `Bearer ${refreshedToken.accessToken}`,
    );
    retriedRequest.flush({});
  });

  it("should propagate errors other than unauthorized", () => {
    let error: unknown;

    httpClient.get(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`).subscribe({
      error: (value: unknown) => {
        error = value;
      },
    });

    httpTestingController
      .expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`)
      .flush("Unavailable", { status: 503, statusText: "Service Unavailable" });

    expect(error).toMatchObject({ status: 503 });
    expect(authService.refreshAccessToken).not.toHaveBeenCalled();
  });

  it("should propagate the refresh error when retrying an unauthorized request", () => {
    const refreshError = new Error("Unable to refresh token");
    let error: unknown;
    authService.refreshAccessToken.mockReturnValue(throwError(() => refreshError));

    httpClient.get(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`).subscribe({
      error: (value: unknown) => {
        error = value;
      },
    });

    httpTestingController
      .expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`)
      .flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    expect(error).toBe(refreshError);
  });
});
