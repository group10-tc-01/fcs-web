import { computed, signal } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { By } from "@angular/platform-browser";
import { Router, provideRouter } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { AuthService, IAuthenticatedUser } from "@features/auth/services/auth.service";
import { Drawer } from "primeng/drawer";
import { of } from "rxjs";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  const user = signal<IAuthenticatedUser | null>(null);
  const authServiceMock = {
    currentUser: computed(() => user()),
    isAuthenticated: computed(() => user() !== null),
    isManager: computed(() => user()?.role === "GestorONG"),
    logout: vi.fn(() => {
      user.set(null);
      return of(undefined);
    }),
  };

  beforeEach(async () => {
    user.set(null);
    authServiceMock.logout.mockClear();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: AuthService, useValue: authServiceMock },
      ],
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

    expect(links).toContainEqual({ href: "/campanhas", text: "Campanhas Ativas" });
    expect(links).not.toContainEqual({ href: "/campanhas", text: "Campanhas" });
    expect(links).toContainEqual({ href: "/sobre", text: "Sobre Nós" });
  });

  it("should render public auth actions when the user is not authenticated", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Entrar");
    expect(compiled.textContent).toContain("Cadastrar");
    expect(compiled.textContent).not.toContain("Sair");
  });

  it("should render authenticated user actions", () => {
    user.set({
      id: "user-id",
      keycloakUserId: "keycloak-user-id",
      name: "Maria Silva",
      email: "maria@email.com",
      role: "Doador",
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Maria");
    expect(compiled.textContent).toContain("Doador");
    expect(compiled.textContent).toContain("Minha Área");
    expect(compiled.textContent).toContain("Sair");
    expect(compiled.textContent).not.toContain("Cadastrar");
  });

  it("should render the manager dashboard label", () => {
    user.set({
      id: "user-id",
      keycloakUserId: "keycloak-user-id",
      name: "Ana Gestora",
      email: "ana@email.com",
      role: "GestorONG",
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Ana");
    expect(compiled.textContent).toContain("GestorONG");
    expect(compiled.textContent).toContain("Painel do Gestor");
  });

  it("should control mobile menu visibility with a signal", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance as unknown as {
      mobileMenuOpen: () => boolean;
      openMobileMenu: () => void;
      closeMobileMenu: () => void;
      updateMobileMenuVisibility: (visible: boolean) => void;
    };

    expect(component.mobileMenuOpen()).toBe(false);

    component.openMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);
    expect(document.documentElement.classList.contains("fcs-scroll-locked")).toBe(true);

    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
    expect(document.documentElement.classList.contains("fcs-scroll-locked")).toBe(false);

    component.updateMobileMenuVisibility(true);
    expect(component.mobileMenuOpen()).toBe(true);
    expect(document.documentElement.classList.contains("fcs-scroll-locked")).toBe(true);

    component.updateMobileMenuVisibility(false);
    expect(component.mobileMenuOpen()).toBe(false);
    expect(document.documentElement.classList.contains("fcs-scroll-locked")).toBe(false);
  });

  it("should block page scroll while the mobile drawer is open", () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const drawer = fixture.debugElement.query(By.directive(Drawer)).componentInstance as Drawer;

    expect(drawer.blockScroll).toBe(true);
  });

  it("should logout the current user, close the mobile menu and navigate home", () => {
    user.set({
      id: "user-id",
      keycloakUserId: "keycloak-user-id",
      name: "Ana Gestora",
      email: "ana@email.com",
      role: "GestorONG",
    });
    const navigateByUrlSpy = vi
      .spyOn(TestBed.inject(Router), "navigateByUrl")
      .mockResolvedValue(true);
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance as unknown as {
      mobileMenuOpen: () => boolean;
      openMobileMenu: () => void;
      logout: () => void;
    };

    component.openMobileMenu();
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalledOnce();
    expect(component.mobileMenuOpen()).toBe(false);
    expect(document.documentElement.classList.contains("fcs-scroll-locked")).toBe(false);
    expect(navigateByUrlSpy).toHaveBeenCalledWith("/");
  });
});
