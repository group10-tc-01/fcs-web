import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

interface IAboutStat {
  label: string;
  value: string;
  icon: string;
}

interface IAboutValue {
  title: string;
  description: string;
  icon: string;
}

interface IPlatformMetric {
  label: string;
  value: string;
}

@Component({
  selector: "fcg-about-page",
  imports: [ButtonModule, RouterLink],
  templateUrl: "./about-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  protected readonly stats: IAboutStat[] = [
    { label: "Anos de Atuação", value: "10+", icon: "pi pi-calendar" },
    { label: "Crianças Atendidas", value: "500+", icon: "pi pi-users" },
    { label: "Campanhas Realizadas", value: "50+", icon: "pi pi-flag" },
    { label: "Doadores Ativos", value: "1.200+", icon: "pi pi-heart" },
  ];

  protected readonly values: IAboutValue[] = [
    {
      title: "Transparência",
      description: "Cada centavo doado é rastreável. Prestamos contas de forma clara e acessível.",
      icon: "pi pi-shield",
    },
    {
      title: "Compromisso",
      description:
        "Trabalhamos incansavelmente para transformar a vida das crianças que acolhemos.",
      icon: "pi pi-star",
    },
    {
      title: "Amor",
      description: "Acreditamos que o amor é a base de toda transformação social duradoura.",
      icon: "pi pi-heart",
    },
    {
      title: "Comunidade",
      description: "Construímos uma rede de apoio onde cada pessoa faz a diferença.",
      icon: "pi pi-users",
    },
  ];

  protected readonly platformMetrics: IPlatformMetric[] = [
    { label: "Transparente", value: "100%" },
    { label: "Disponível", value: "24/7" },
    { label: "Criptografado", value: "Seguro" },
  ];
}
