import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

import { NotificationService } from "@core/services/notification.service";
import { AuthService } from "@features/auth/services/auth.service";

type LoginControlName = "email" | "senha";

@Component({
  selector: "fcg-login-page",
  imports: [ButtonModule, MessageModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal("");
  protected readonly submitButtonLabel = computed(() =>
    this.isSubmitting() ? "Entrando..." : "Entrar",
  );

  protected readonly loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    senha: ["", [Validators.required]],
  });

  protected submit(): void {
    this.submitError.set("");

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.submitError.set("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const value = this.loginForm.getRawValue();

    this.isSubmitting.set(true);
    this.authService
      .login({
        email: value.email.trim(),
        password: value.senha,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            "Login realizado",
            "Voce entrou na sua conta com sucesso.",
          );
          void this.router.navigateByUrl("/dashboard");
        },
        error: () => {
          this.submitError.set("Email ou senha incorretos. Tente novamente.");
        },
      });
  }

  protected isInvalid(controlName: LoginControlName): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected controlError(controlName: LoginControlName): string {
    const control = this.loginForm.controls[controlName];

    if (control.hasError("required")) {
      return "Campo obrigatorio.";
    }

    if (control.hasError("email")) {
      return "Informe um email valido.";
    }

    return "Campo invalido.";
  }
}
