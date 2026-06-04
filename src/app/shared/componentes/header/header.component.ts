import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DrawerModule } from "primeng/drawer";

interface INavigationItem {
  label: string;
  route: string;
}

@Component({
  selector: "fcg-header",
  imports: [ButtonModule, DrawerModule, RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly mobileMenuOpen = signal(false);

  protected readonly navigationItems: INavigationItem[] = [
    { label: "Campanhas", route: "/campanhas" },
    { label: "Transparência", route: "/transparencia" },
    { label: "Sobre Nós", route: "/sobre" },
  ];

  protected openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected updateMobileMenuVisibility(visible: boolean): void {
    this.mobileMenuOpen.set(visible);
  }
}
