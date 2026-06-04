import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { FormGroup } from "@angular/forms";
import { Router, provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { AuthService, IAuthenticatedUser } from "@features/auth/services/auth.service";
import { of, throwError } from "rxjs";

import { LoginPageComponent } from "./login-page.component";

describe("LoginPageComponent", () => {
  const authenticatedUser: IAuthenticatedUser = {
    id: "user-id",
    keycloakUserId: "keycloak-user-id",
    name: "Maria Silva",
    email: "maria@email.com",
    role: "Doador",
  };

  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let notificationServiceMock: { success: ReturnType<typeof vi.fn> };
  let navigateByUrlSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
    };
    notificationServiceMock = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    navigateByUrlSpy = vi.spyOn(TestBed.inject(Router), "navigateByUrl").mockResolvedValue(true);
  });

  it("should show validation feedback when submitted with invalid fields", () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;

    component.submit();

    expect(component.submitError()).toBe("Por favor, preencha todos os campos corretamente.");
    expect(component.isInvalid("email")).toBe(true);
    expect(component.isInvalid("senha")).toBe(true);
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it("should toggle password visibility", () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;

    expect(component.passwordInputType()).toBe("password");
    expect(component.passwordToggleLabel()).toContain("Mostrar");

    component.togglePasswordVisibility();

    expect(component.passwordInputType()).toBe("text");
    expect(component.passwordToggleLabel()).toContain("Ocultar");
  });

  it("should render validation errors and the visible password icon", () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;

    component.submit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("#email-error")?.textContent).toContain("Campo");
    expect(compiled.querySelector("#senha-error")?.textContent).toContain("Campo");
    expect(compiled.querySelector("#email")?.getAttribute("aria-invalid")).toBe("true");
    expect(compiled.textContent).toContain("Por favor");

    component.togglePasswordVisibility();
    fixture.detectChanges();

    expect(compiled.querySelector(".pi-eye-slash")).not.toBeNull();
  });

  it("should submit valid credentials and navigate to dashboard", () => {
    authServiceMock.login.mockReturnValue(of(authenticatedUser));
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;
    component.loginForm.setValue({ email: "maria@email.com", senha: "secret" });

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: "maria@email.com",
      password: "secret",
    });
    expect(notificationServiceMock.success).toHaveBeenCalledWith(
      "Login realizado",
      expect.any(String),
    );
    expect(navigateByUrlSpy).toHaveBeenCalledWith("/dashboard");
    expect(component.isSubmitting()).toBe(false);
  });

  it("should show a submit error when login fails", () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error("invalid credentials")));
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;
    component.loginForm.setValue({ email: "maria@email.com", senha: "wrong" });

    component.submit();

    expect(component.submitError()).toBe("E-mail ou senha incorretos. Tente novamente.");
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it("should return field-specific validation messages", () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance as unknown as ILoginComponentHarness;

    component.loginForm.controls["email"].markAsTouched();
    expect(component.controlError("email")).toContain("Campo");

    component.loginForm.controls["email"].setValue("invalid-email");
    expect(component.controlError("email")).toContain("e-mail");
  });
});

interface ILoginComponentHarness {
  loginForm: FormGroup;
  isSubmitting(): boolean;
  submitError(): string;
  passwordInputType(): string;
  passwordToggleLabel(): string;
  submit(): void;
  togglePasswordVisibility(): void;
  isInvalid(controlName: "email" | "senha"): boolean;
  controlError(controlName: "email" | "senha"): string;
}
