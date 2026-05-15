import { TestBed } from "@angular/core/testing";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { globalHttpErrorInterceptor } from "@core/error-handling/global-http-error.interceptor";
import { httpErrorTestInterceptor } from "@core/error-handling/http-error-test.interceptor";
import { AppComponent } from "./app";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(withInterceptors([globalHttpErrorInterceptor, httpErrorTestInterceptor])),
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
    expect(compiled.querySelector("h1")?.textContent).toContain("FCG Solidarity");
  });

  it("should simulate an HTTP error scenario", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = Array.from(compiled.querySelectorAll("button")).find(
      (element) => element.textContent?.trim() === "404",
    );

    button?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(compiled.textContent).toContain("Ultimo erro simulado: HTTP 404");
  });
});
