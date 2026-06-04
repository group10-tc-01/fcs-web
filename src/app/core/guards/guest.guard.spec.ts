import { TestBed } from "@angular/core/testing";
import { Router, UrlTree, provideRouter } from "@angular/router";
import { AuthService } from "@features/auth/services/auth.service";
import { firstValueFrom, Observable, of } from "rxjs";

import { guestGuard } from "./guest.guard";

describe("guestGuard", () => {
  let authServiceMock: { ensureAuthenticated: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(() => {
    authServiceMock = {
      ensureAuthenticated: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    });

    router = TestBed.inject(Router);
  });

  it("should allow access when the user is not authenticated", async () => {
    authServiceMock.ensureAuthenticated.mockReturnValue(of(false));

    const result = await runGuard();

    expect(result).toBe(true);
  });

  it("should redirect to dashboard when the user is authenticated", async () => {
    authServiceMock.ensureAuthenticated.mockReturnValue(of(true));

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe("/dashboard");
  });

  function runGuard(): Promise<boolean | UrlTree> {
    return TestBed.runInInjectionContext(() =>
      firstValueFrom(guestGuard({} as never, {} as never) as Observable<boolean | UrlTree>),
    );
  }
});
