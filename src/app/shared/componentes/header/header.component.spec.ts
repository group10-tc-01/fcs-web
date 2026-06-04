import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();
  });

  it("should render the brand", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Conexão Solidária");
  });

  it("should render public navigation links", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll("a")).map((link) => ({
      href: link.getAttribute("href"),
      text: link.textContent?.trim(),
    }));

    expect(links).toContainEqual({ href: "/campanhas", text: "Campanhas" });
    expect(links).toContainEqual({ href: "/transparencia", text: "Transparência" });
    expect(links).toContainEqual({ href: "/sobre", text: "Sobre Nós" });
  });

  it("should render public auth actions", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Entrar");
    expect(compiled.textContent).toContain("Cadastrar");
  });

  it("should control mobile menu visibility with a signal", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance as unknown as {
      mobileMenuOpen: () => boolean;
      openMobileMenu: () => void;
      closeMobileMenu: () => void;
    };

    expect(component.mobileMenuOpen()).toBe(false);

    component.openMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);

    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });
});
