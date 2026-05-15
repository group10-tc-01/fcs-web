import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NotificationService } from "@core/notifications/notification.service";
import { catchError, throwError } from "rxjs";

export const globalHttpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        console.error("[GlobalHttpErrorInterceptor]", {
          method: request.method,
          url: request.urlWithParams,
          status: error.status,
          message: error.message,
        });

        notificationService.error("Erro na requisicao", getHttpErrorMessage(error));
      }

      return throwError(() => error);
    }),
  );
};

function getHttpErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return "Nao foi possivel conectar ao servidor.";
    case 400:
      return "Verifique os dados enviados.";
    case 401:
      return "Sua sessao expirou.";
    case 403:
      return "Voce nao tem permissao para executar esta acao.";
    case 404:
      return "Recurso nao encontrado.";
    case 500:
      return "Erro interno. Tente novamente em instantes.";
    default:
      return "Algo deu errado ao processar a requisicao.";
  }
}
