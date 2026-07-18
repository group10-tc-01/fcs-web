import { TestBed } from "@angular/core/testing";

import { GlobalErrorHandlerService } from "./global-error-handler.service";
import { NotificationService } from "./notification.service";

describe("GlobalErrorHandlerService", () => {
  let notificationService: { error: ReturnType<typeof vi.fn> };
  let service: GlobalErrorHandlerService;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    notificationService = { error: vi.fn() };
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandlerService,
        { provide: NotificationService, useValue: notificationService },
      ],
    });

    service = TestBed.inject(GlobalErrorHandlerService);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it.each([
    [new Error("Failure"), "Failure"],
    ["Failure", "Failure"],
    [{ reason: "Failure" }, "Unexpected application error"],
  ])("should normalize errors before notifying the user", (error, message) => {
    service.handleError(error);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalledWith("Erro inesperado", message);
  });
});
