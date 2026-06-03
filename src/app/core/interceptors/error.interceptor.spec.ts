import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { errorInterceptor } from "./error.interceptor";

describe("errorInterceptor", () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationService: { error: ReturnType<typeof vi.fn> };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Arrange
    notificationService = {
      error: vi.fn(),
    };

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    consoleErrorSpy.mockRestore();
  });

  it.each([
    [400, "Verifique os dados enviados."],
    [401, "Sua sessão expirou."],
    [403, "Você não tem permissão para executar esta ação."],
    [404, "Recurso não encontrado."],
    [500, "Erro interno. Tente novamente em instantes."],
    [418, "Algo deu errado ao processar a requisição."],
  ])("should notify the user when the API returns HTTP %s", (status, message) => {
    // Arrange
    const url = `/api/error-${status}`;

    // Act
    httpClient.get(url).subscribe({
      next: () => {
        throw new Error("A requisição deveria falhar.");
      },
      error: () => undefined,
    });

    httpTestingController.expectOne(url).flush({ message: "Erro" }, { status, statusText: "Erro" });

    // Assert
    expect(notificationService.error).toHaveBeenCalledWith("Erro na requisição", message);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
