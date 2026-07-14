import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";

import { routes } from "./app.routes";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { authInterceptor } from "@core/interceptors/auth.interceptor";
import { httpErrorTestInterceptor } from "@core/interceptors/http-error-test.interceptor";
import { GlobalErrorHandlerService } from "@core/services/global-error-handler.service";
import { FcsPrimePreset } from "@core/config/theme.preset";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, httpErrorTestInterceptor]),
    ),
    provideRouter(routes),
    MessageService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    providePrimeNG({
      theme: {
        preset: FcsPrimePreset,
        options: {
          darkModeSelector: ".dark",
        },
      },
    }),
  ],
};
