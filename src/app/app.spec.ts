import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { httpErrorTestInterceptor } from "@core/interceptors/http-error-test.interceptor";
import { AppComponent } from "./app";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([errorInterceptor, httpErrorTestInterceptor])),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should render the shared header", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("fcg-header")?.textContent).toContain("Conexão Solidária");
  });

  it("should render public navigation", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Campanhas");
    expect(compiled.textContent).toContain("Transparência");
    expect(compiled.textContent).toContain("Sobre Nós");
  });

  it("should render the landing hero", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain("Sua doação transforma");
    expect(compiled.textContent).toContain("vidas");
    expect(compiled.textContent).toContain("Doar Agora");
    expect(compiled.textContent).toContain("Ver Transparência");
  });
});
