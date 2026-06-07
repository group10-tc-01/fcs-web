import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

import {
  CampaignService,
  ITransparencyCampaign,
} from "@features/campaigns/services/campaign.service";
import { LoadingComponent } from "@shared/componentes/loading/loading.component";

interface ICampaignCard {
  title: string;
  financialGoal: number;
  totalAmountRaised: number;
  progress: number;
}

@Component({
  selector: "fcs-campaigns-page",
  imports: [ButtonModule, LoadingComponent, RouterLink],
  templateUrl: "./campaigns-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsPageComponent {
  private readonly campaignService = inject(CampaignService);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal("");
  protected readonly campaigns = signal<ICampaignCard[]>([]);
  protected readonly totalRaised = computed(() =>
    this.campaigns().reduce((total, campaign) => total + campaign.totalAmountRaised, 0),
  );

  constructor() {
    this.loadCampaigns();
  }

  protected reload(): void {
    this.loadCampaigns();
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  private loadCampaigns(): void {
    this.loading.set(true);
    this.errorMessage.set("");

    this.campaignService.getTransparencyCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns.set(campaigns.map((campaign) => this.toCampaignCard(campaign)));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Não foi possível carregar as campanhas ativas.");
        this.loading.set(false);
      },
    });
  }

  private toCampaignCard(campaign: ITransparencyCampaign): ICampaignCard {
    const progress =
      campaign.financialGoal > 0
        ? Math.min(Math.round((campaign.totalAmountRaised / campaign.financialGoal) * 100), 100)
        : 0;

    return {
      ...campaign,
      progress,
    };
  }
}
