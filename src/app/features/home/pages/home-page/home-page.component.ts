import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

interface IFeatureCard {
  icon: string;
  title: string;
  description: string;
  tone: "primary" | "accent" | "chart";
}

@Component({
  selector: "fcs-home-page",
  imports: [ButtonModule, RouterLink],
  templateUrl: "./home-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
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
