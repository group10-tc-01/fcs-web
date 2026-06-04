import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

interface IFooterLink {
  label: string;
  route: string;
}

@Component({
  selector: "fcg-footer",
  imports: [RouterLink],
  templateUrl: "./footer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly quickLinks: IFooterLink[] = [
    { label: "Campanhas", route: "/campanhas" },
    { label: "Transparência", route: "/transparencia" },
    { label: "Sobre Nós", route: "/sobre" },
    { label: "Seja um Doador", route: "/cadastro" },
  ];
}
