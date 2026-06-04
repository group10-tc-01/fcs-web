import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { FooterComponent } from "@shared/componentes/footer/footer.component";
import { HeaderComponent } from "@shared/componentes/header/header.component";

interface IFeatureCard {
  icon: string;
  title: string;
  description: string;
  tone: "primary" | "accent" | "chart";
}

@Component({
  selector: "fcg-root",
  imports: [ButtonModule, FooterComponent, HeaderComponent, RouterLink, RouterOutlet, ToastModule],
  templateUrl: "./app.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = "fcg-solidarity-web";

  protected readonly featureCards: IFeatureCard[] = [
    {
      icon: "pi pi-shield",
      title: "100% Transparente",
      description:
        "Acompanhe em tempo real o destino de cada doação através do nosso painel de transparência.",
      tone: "primary",
    },
    {
      icon: "pi pi-users",
      title: "Comunidade Ativa",
      description: "Faça parte de uma rede de mais de 1.000 doadores comprometidos com a causa.",
      tone: "accent",
    },
    {
      icon: "pi pi-check-circle",
      title: "Impacto Comprovado",
      description:
        "Mais de 10 anos de história com resultados mensuráveis na vida de centenas de crianças.",
      tone: "chart",
    },
  ];
}
