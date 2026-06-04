import { DOCUMENT } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DrawerModule } from "primeng/drawer";

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
  private readonly document = inject(DOCUMENT);

  private scrollLockTop = 0;

  protected readonly mobileMenuOpen = signal(false);

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
