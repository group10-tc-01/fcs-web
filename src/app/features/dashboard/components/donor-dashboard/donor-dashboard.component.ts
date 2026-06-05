import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { IAuthenticatedUser } from "@features/auth/services/auth.service";

interface IDonationSummary {
  campaign: string;
  value: string;
  status: "Processada" | "Pendente";
  date: string;
}

@Component({
  selector: "fcs-donor-dashboard",
  imports: [ButtonModule, RouterLink],
  templateUrl: "./donor-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorDashboardComponent {
  readonly user = input.required<IAuthenticatedUser>();

  protected readonly donations: IDonationSummary[] = [
    { campaign: "Natal Solidário", value: "R$ 150,00", status: "Processada", date: "12/12/2026" },
    { campaign: "Material Escolar", value: "R$ 80,00", status: "Processada", date: "03/11/2026" },
  ];
}
