import { provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";

import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("should render the brand and description", () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Conexão Solidária");
    expect(compiled.textContent).toContain("Plataforma digital da ONG Esperança Solidária");
  });

  it("should render quick links", () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll("a")).map((link) => ({
      href: link.getAttribute("href"),
      text: link.textContent?.trim(),
    }));

    expect(links).toContainEqual({ href: "/campanhas", text: "Campanhas" });
    expect(links).toContainEqual({ href: "/transparencia", text: "Transparência" });
    expect(links).toContainEqual({ href: "/sobre", text: "Sobre Nós" });
    expect(links).toContainEqual({ href: "/cadastro", text: "Seja um Doador" });
  });

  it("should render contact information", () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("contato@esperancasolidaria.org");
    expect(compiled.textContent).toContain("São Paulo - SP");
  });
});
