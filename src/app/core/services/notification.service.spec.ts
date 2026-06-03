import { TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let messageService: { add: ReturnType<typeof vi.fn> };
  let service: NotificationService;

  beforeEach(() => {
    // Arrange
    messageService = {
      add: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: MessageService, useValue: messageService }],
    });

    service = TestBed.inject(NotificationService);
  });

  it("should show an error notification", () => {
    // Act
    service.error("Erro", "Falha ao processar a requisição.");

    // Assert
    expect(messageService.add).toHaveBeenCalledWith({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao processar a requisição.",
      life: 5000,
    });
  });

  it("should show a success notification", () => {
    // Act
    service.success("Sucesso", "Operação concluída.");

    // Assert
    expect(messageService.add).toHaveBeenCalledWith({
      severity: "success",
      summary: "Sucesso",
      detail: "Operação concluída.",
      life: 3000,
    });
  });
});
