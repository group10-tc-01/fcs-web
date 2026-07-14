import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { IAuthenticatedUser } from "@features/auth/services/auth.service";
import { CampaignService, ICampaign } from "@features/campaigns/services/campaign.service";

@Component({
  selector: "fcs-manager-dashboard",
  imports: [ButtonModule, RouterLink],
  templateUrl: "./manager-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent {
  private readonly campaignService = inject(CampaignService);

  readonly user = input.required<IAuthenticatedUser>();
  protected readonly campaigns = signal<ICampaign[]>([]);
  protected readonly totalRaised = computed(() =>
    this.campaigns().reduce((total, campaign) => total + campaign.totalAmountRaised, 0),
  );
  protected readonly activeCampaigns = computed(
    () => this.campaigns().filter((campaign) => campaign.status === "Active").length,
  );

  constructor() {
    this.campaignService.getCampaigns().subscribe({
      next: (response) => this.campaigns.set(response.items),
    });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  protected progress(campaign: ICampaign): number {
    return campaign.financialGoal > 0
      ? Math.min(Math.round((campaign.totalAmountRaised / campaign.financialGoal) * 100), 100)
      : 0;
  }
}
