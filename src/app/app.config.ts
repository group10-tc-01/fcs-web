import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeuix/themes/aura";

import { routes } from "./app.routes";
import { GlobalErrorHandlerService } from "@core/error-handling/global-error-handler.service";
import { globalHttpErrorInterceptor } from "@core/error-handling/global-http-error.interceptor";
import { httpErrorTestInterceptor } from "@core/error-handling/http-error-test.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([globalHttpErrorInterceptor, httpErrorTestInterceptor])),
    provideRouter(routes),
    MessageService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
