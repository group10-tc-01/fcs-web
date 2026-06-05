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

  it("should render the shared shell", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("fcs-header")?.textContent).toContain("Conexão Solidária");
    expect(compiled.querySelector("router-outlet")).toBeTruthy();
    expect(compiled.querySelector("fcs-footer")?.textContent).toContain("Links Rápidos");
  });

  it("should render the responsive toast host", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector("p-toast");

    expect(toast?.getAttribute("position")).toBe("top-right");
    expect(toast?.getAttribute("styleclass")).toBe("fcs-toast");
  });
});
