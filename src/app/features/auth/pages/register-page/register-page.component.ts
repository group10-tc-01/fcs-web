import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

import { NotificationService } from "@core/services/notification.service";
import { AuthService } from "@features/auth/services/auth.service";

type RegisterControlName = "nomeCompleto" | "email" | "cpf" | "senha" | "confirmarSenha";

@Component({
  selector: "fcs-register-page",
  imports: [ButtonModule, MessageModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly isPasswordVisible = signal(false);
  protected readonly isPasswordConfirmationVisible = signal(false);
  protected readonly submitError = signal("");
  protected readonly passwordInputType = computed(() =>
    this.isPasswordVisible() ? "text" : "password",
  );
  protected readonly passwordConfirmationInputType = computed(() =>
    this.isPasswordConfirmationVisible() ? "text" : "password",
  );
  protected readonly passwordToggleLabel = computed(() =>
    this.isPasswordVisible() ? "Ocultar senha" : "Mostrar senha",
  );
  protected readonly passwordConfirmationToggleLabel = computed(() =>
    this.isPasswordConfirmationVisible()
      ? "Ocultar confirmação de senha"
      : "Mostrar confirmação de senha",
  );
  protected readonly submitButtonLabel = computed(() =>
    this.isSubmitting() ? "Criando conta..." : "Criar Conta",
  );

  protected readonly registerForm = this.formBuilder.group(
    {
      nomeCompleto: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      cpf: ["", [Validators.required, RegisterPageComponent.cpfValidator]],
      senha: ["", [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ["", [Validators.required]],
    },
    { validators: RegisterPageComponent.matchingPasswordsValidator },
  );

  protected submit(): void {
    this.submitError.set("");

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.submitError.set("Por favor, corrija os campos destacados.");
      return;
    }

    const value = this.registerForm.getRawValue();

    this.isSubmitting.set(true);
    this.authService
      .register({
        fullName: value.nomeCompleto.trim(),
        email: value.email.trim(),
        cpf: RegisterPageComponent.onlyDigits(value.cpf),
        password: value.senha,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            "Conta criada",
            "Cadastro realizado com sucesso. Você já pode acessar sua conta.",
          );
          void this.router.navigateByUrl("/login");
        },
        error: () => {
          this.submitError.set("Erro ao criar conta. O e-mail pode já estar em uso.");
        },
      });
  }

  protected formatCpf(): void {
    const cpf = RegisterPageComponent.onlyDigits(this.registerForm.controls.cpf.value).slice(0, 11);
    const formattedCpf = cpf
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    this.registerForm.controls.cpf.setValue(formattedCpf, { emitEvent: false });
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((isVisible) => !isVisible);
  }

  protected togglePasswordConfirmationVisibility(): void {
    this.isPasswordConfirmationVisible.update((isVisible) => !isVisible);
  }

  protected isInvalid(controlName: RegisterControlName): boolean {
    const control = this.registerForm.controls[controlName];
    const shouldShowError = control.touched || control.dirty;

    if (controlName === "confirmarSenha" && this.registerForm.hasError("passwordMismatch")) {
      return shouldShowError;
    }

    return control.invalid && shouldShowError;
  }

  protected controlError(controlName: RegisterControlName): string {
    const control = this.registerForm.controls[controlName];

    if (control.hasError("required")) {
      return "Campo obrigatório.";
    }

    if (control.hasError("email")) {
      return "Informe um e-mail válido.";
    }

    if (control.hasError("minlength")) {
      return controlName === "senha"
        ? "A senha deve ter no mínimo 8 caracteres."
        : "Informe seu nome completo.";
    }

    if (control.hasError("invalidCpf")) {
      return "CPF inválido. Verifique e tente novamente.";
    }

    if (controlName === "confirmarSenha" && this.registerForm.hasError("passwordMismatch")) {
      return "As senhas não coincidem.";
    }

    return "Campo inválido.";
  }

  private static matchingPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get("senha")?.value;
    const confirmarSenha = control.get("confirmarSenha")?.value;

    if (!senha || !confirmarSenha || senha === confirmarSenha) {
      return null;
    }

    return { passwordMismatch: true };
  }

  private static cpfValidator(control: AbstractControl<string>): ValidationErrors | null {
    const cpf = RegisterPageComponent.onlyDigits(control.value);

    if (!cpf) {
      return null;
    }

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    const firstDigit = RegisterPageComponent.calculateCpfDigit(cpf, 9);
    const secondDigit = RegisterPageComponent.calculateCpfDigit(cpf, 10);

    return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
      ? null
      : { invalidCpf: true };
  }

  private static calculateCpfDigit(cpf: string, length: number): number {
    const sum = cpf
      .slice(0, length)
      .split("")
      .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
    const rest = (sum * 10) % 11;

    return rest === 10 ? 0 : rest;
  }

  private static onlyDigits(value: string): string {
    return value.replace(/\D/g, "");
  }
}
