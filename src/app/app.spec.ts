import { TestBed } from "@angular/core/testing";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { httpErrorTestInterceptor } from "@core/interceptors/http-error-test.interceptor";
import { AppComponent } from "./app";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor, httpErrorTestInterceptor])),
        MessageService,
      ],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should render title", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain("Conexão Solidária");
  });

  it("should render the project setup status", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Angular + Tailwind + PrimeNG");
    expect(compiled.textContent).toContain("Convenção");
  });
});
