import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DrawerModule } from "primeng/drawer";
import { AuthService } from "@features/auth/services/auth.service";

interface INavigationItem {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: "fcg-header",
  imports: [ButtonModule, DrawerModule, RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private scrollLockTop = 0;

  protected readonly mobileMenuOpen = signal(false);
  protected readonly currentUser = this.authService.currentUser;
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isManager = this.authService.isManager;
  protected readonly firstName = computed(() => this.currentUser()?.name.split(" ")[0] ?? "");
  protected readonly profileLabel = computed(() => (this.isManager() ? "GestorONG" : "Doador"));
  protected readonly dashboardLabel = computed(() =>
    this.isManager() ? "Painel do Gestor" : "Minha Área",
  );

  protected readonly navigationItems: INavigationItem[] = [
    {
      label: "Campanhas",
      route: "/campanhas",
      icon: "pi pi-heart",
      description: "Escolha uma causa para apoiar",
    },
    {
      label: "Transparência",
      route: "/transparencia",
      icon: "pi pi-chart-line",
      description: "Veja a aplicação das doações",
    },
    {
      label: "Sobre Nós",
      route: "/sobre",
      icon: "pi pi-info-circle",
      description: "Conheça a ONG e a missão",
    },
  ];

  protected openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
    this.updateDocumentScrollLock(true);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.updateDocumentScrollLock(false);
  }

  protected updateMobileMenuVisibility(visible: boolean): void {
    this.mobileMenuOpen.set(visible);
    this.updateDocumentScrollLock(visible);
  }

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeMobileMenu();
        void this.router.navigateByUrl("/");
      },
    });
  }

  ngOnDestroy(): void {
    this.updateDocumentScrollLock(false);
  }

  private updateDocumentScrollLock(locked: boolean): void {
    const root = this.document.documentElement;
    const body = this.document.body;
    const windowRef = this.document.defaultView;
    const wasLocked = root.classList.contains("fcg-scroll-locked");

    if (locked) {
      if (!wasLocked) {
        this.scrollLockTop = windowRef?.scrollY ?? root.scrollTop;
        body.style.top = `-${this.scrollLockTop}px`;
      }

      root.classList.add("fcg-scroll-locked");
      body.classList.add("fcg-scroll-locked");
      return;
    }

    root.classList.remove("fcg-scroll-locked");
    body.classList.remove("fcg-scroll-locked");
    body.style.removeProperty("top");

    if (wasLocked) {
      const scrollingElement = this.document.scrollingElement ?? root;
      scrollingElement.scrollTop = this.scrollLockTop;
    }
  }
}
