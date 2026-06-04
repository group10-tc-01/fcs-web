import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { catchError, throwError } from "rxjs";

export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (request.context.get(SKIP_ERROR_NOTIFICATION)) {
          return throwError(() => error);
        }

        console.error("[ErrorInterceptor]", {
          method: request.method,
          url: request.urlWithParams,
          status: error.status,
          message: error.message,
        });

        notificationService.error("Erro na requisição", getHttpErrorMessage(error));
      }

      return throwError(() => error);
    }),
  );
};

function getHttpErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return "Não foi possível conectar ao servidor.";
    case 400:
      return "Verifique os dados enviados.";
    case 401:
      return "Sua sessão expirou.";
    case 403:
      return "Você não tem permissão para executar esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 500:
      return "Erro interno. Tente novamente em instantes.";
    default:
      return "Algo deu errado ao processar a requisição.";
  }
}
