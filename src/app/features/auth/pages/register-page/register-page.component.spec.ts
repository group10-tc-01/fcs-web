import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { FormGroup } from "@angular/forms";
import { Router, provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { AuthService, IRegisterResponse } from "@features/auth/services/auth.service";
import { of, throwError } from "rxjs";

import { RegisterPageComponent } from "./register-page.component";

describe("RegisterPageComponent", () => {
  const registerResponse: IRegisterResponse = {
    id: "donor-id",
    fullName: "Maria Silva",
    email: "maria@email.com",
    cpf: "12345678909",
  };

  let authServiceMock: { register: ReturnType<typeof vi.fn> };
  let notificationServiceMock: { success: ReturnType<typeof vi.fn> };
  let navigateByUrlSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn(),
    };
    notificationServiceMock = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
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
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;

    component.submit();

    expect(component.submitError()).toBe("Por favor, corrija os campos destacados.");
    expect(component.isInvalid("nomeCompleto")).toBe(true);
    expect(component.isInvalid("email")).toBe(true);
    expect(component.isInvalid("cpf")).toBe(true);
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it("should format CPF input", () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;
    component.registerForm.controls["cpf"].setValue("12345678909");

    component.formatCpf();

    expect(component.registerForm.controls["cpf"].value).toBe("123.456.789-09");
  });

  it("should validate CPF, password length and password confirmation", () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;

    component.registerForm.patchValue({
      nomeCompleto: "Maria Silva",
      email: "maria@email.com",
      cpf: "111.111.111-11",
      senha: "short",
      confirmarSenha: "different",
    });
    component.registerForm.markAllAsTouched();

    expect(component.isInvalid("cpf")).toBe(true);
    expect(component.controlError("cpf")).toContain("CPF");
    expect(component.isInvalid("senha")).toBe(true);
    expect(component.controlError("senha")).toContain("senha");
    expect(component.isInvalid("confirmarSenha")).toBe(true);
    expect(component.controlError("confirmarSenha")).toContain("senhas");
  });

  it("should toggle password and confirmation visibility independently", () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;

    expect(component.passwordInputType()).toBe("password");
    expect(component.passwordConfirmationInputType()).toBe("password");

    component.togglePasswordVisibility();
    component.togglePasswordConfirmationVisibility();

    expect(component.passwordInputType()).toBe("text");
    expect(component.passwordConfirmationInputType()).toBe("text");
    expect(component.passwordToggleLabel()).toContain("Ocultar");
    expect(component.passwordConfirmationToggleLabel()).toContain("Ocultar");
  });

  it("should render validation errors and visible password icons", () => {
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;

    component.submit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("#nomeCompleto-error")?.textContent).toContain("Campo");
    expect(compiled.querySelector("#email-error")?.textContent).toContain("Campo");
    expect(compiled.querySelector("#cpf-error")?.textContent).toContain("Campo");
    expect(compiled.textContent).toContain("Por favor");

    component.togglePasswordVisibility();
    component.togglePasswordConfirmationVisibility();
    fixture.detectChanges();

    expect(compiled.querySelectorAll(".pi-eye-slash").length).toBe(2);
  });

  it("should submit a valid registration and navigate to login", () => {
    authServiceMock.register.mockReturnValue(of(registerResponse));
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;
    fillValidForm(component);

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      fullName: "Maria Silva",
      email: "maria@email.com",
      cpf: "12345678909",
      password: "StrongPassword123!",
    });
    expect(notificationServiceMock.success).toHaveBeenCalledWith(
      "Conta criada",
      expect.any(String),
    );
    expect(navigateByUrlSpy).toHaveBeenCalledWith("/login");
    expect(component.isSubmitting()).toBe(false);
  });

  it("should show a submit error when registration fails", () => {
    authServiceMock.register.mockReturnValue(throwError(() => new Error("duplicated email")));
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const component = fixture.componentInstance as unknown as IRegisterComponentHarness;
    fillValidForm(component);

    component.submit();

    expect(component.submitError()).toContain("e-mail");
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  function fillValidForm(component: IRegisterComponentHarness): void {
    component.registerForm.setValue({
      nomeCompleto: "Maria Silva",
      email: "maria@email.com",
      cpf: "123.456.789-09",
      senha: "StrongPassword123!",
      confirmarSenha: "StrongPassword123!",
    });
  }
});

interface IRegisterComponentHarness {
  registerForm: FormGroup;
  isSubmitting(): boolean;
  submitError(): string;
  passwordInputType(): string;
  passwordConfirmationInputType(): string;
  passwordToggleLabel(): string;
  passwordConfirmationToggleLabel(): string;
  submit(): void;
  formatCpf(): void;
  togglePasswordVisibility(): void;
  togglePasswordConfirmationVisibility(): void;
  isInvalid(controlName: "nomeCompleto" | "email" | "cpf" | "senha" | "confirmarSenha"): boolean;
  controlError(controlName: "nomeCompleto" | "email" | "cpf" | "senha" | "confirmarSenha"): string;
}
