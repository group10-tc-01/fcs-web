import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { httpErrorTestInterceptor } from "./http-error-test.interceptor";

describe("httpErrorTestInterceptor", () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorTestInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should pass through requests outside the error test URL", () => {
    // Act
    httpClient.get("/api/health").subscribe((response) => {
      // Assert
      expect(response).toEqual({ status: "ok" });
    });

    httpTestingController.expectOne("/api/health").flush({ status: "ok" });
  });

  it("should simulate an HTTP error for the error test URL", () => {
    // Act
    httpClient.get("/__error-test/404").subscribe({
      next: () => {
        throw new Error("A requisição deveria falhar.");
      },
      error: (error: unknown) => {
        // Assert
        expect(error).toMatchObject({
          status: 404,
          statusText: "Not found",
          url: "/__error-test/404",
        });
      },
    });
  });

  it("should use a fallback message for an unexpected test status", () => {
    // Act
    httpClient.get("/__error-test/499").subscribe({
      next: () => {
        throw new Error("A requisição deveria falhar.");
      },
      error: (error: unknown) => {
        // Assert
        expect(error).toMatchObject({
          status: 499,
          statusText: "Unexpected error",
          url: "/__error-test/499",
        });
      },
    });
  });
});
