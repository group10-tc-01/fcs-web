import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ButtonModule } from "primeng/button";

import { IAuthenticatedUser } from "@features/auth/services/auth.service";

interface ICampaignSummary {
  title: string;
  status: "Ativa" | "Concluída" | "Cancelada";
  goal: string;
  raised: string;
  progress: number;
}

@Component({
  selector: "fcg-manager-dashboard",
  imports: [ButtonModule],
  templateUrl: "./manager-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent {
  readonly user = input.required<IAuthenticatedUser>();

  protected readonly campaigns: ICampaignSummary[] = [
    {
      title: "Natal Solidário",
      status: "Ativa",
      goal: "R$ 50.000,00",
      raised: "R$ 32.500,00",
      progress: 65,
    },
    {
      title: "Material Escolar",
      status: "Ativa",
      goal: "R$ 20.000,00",
      raised: "R$ 11.800,00",
      progress: 59,
    },
    {
      title: "Inverno Acolhedor",
      status: "Concluída",
      goal: "R$ 15.000,00",
      raised: "R$ 15.000,00",
      progress: 100,
    },
  ];
}
