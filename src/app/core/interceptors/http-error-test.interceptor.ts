import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { throwError } from "rxjs";

const errorTestUrlPrefix = "/__error-test/";

const errorMessages = new Map<number, string>([
  [400, "Bad request"],
  [401, "Unauthorized"],
  [403, "Forbidden"],
  [404, "Not found"],
  [500, "Internal server error"],
]);

export const httpErrorTestInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(errorTestUrlPrefix)) {
    return next(request);
  }

  const status = Number(request.url.replace(errorTestUrlPrefix, ""));
  const statusText = errorMessages.get(status) ?? "Unexpected error";

  return throwError(
    () =>
      new HttpErrorResponse({
        error: {
          message: statusText,
        },
        status,
        statusText,
        url: request.url,
      }),
  );
};
