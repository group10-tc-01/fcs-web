import { ErrorHandler, Injectable, inject } from "@angular/core";
import { NotificationService } from "@core/notifications/notification.service";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);

  handleError(error: unknown): void {
    const normalizedError = this.normalizeError(error);

    console.error("[GlobalErrorHandler]", normalizedError);
    this.notificationService.error("Erro inesperado", "Tente novamente em instantes.");
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === "string") {
      return new Error(error);
    }

    return new Error("Unexpected application error", {
      cause: error,
    });
  }
}
