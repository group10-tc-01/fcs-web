import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { IAuthenticatedUser } from "@features/auth/services/auth.service";
import { DonationService, IDonation } from "@features/donations/services/donation.service";

@Component({
  selector: "fcs-donor-dashboard",
  imports: [ButtonModule, RouterLink],
  templateUrl: "./donor-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorDashboardComponent {
  private readonly donationService = inject(DonationService);

  readonly user = input.required<IAuthenticatedUser>();
  protected readonly donations = signal<IDonation[]>([]);
  protected readonly loading = signal(true);
  protected readonly totalDonated = computed(() =>
    this.donations().reduce((total, donation) => total + donation.amount, 0),
  );
  protected readonly supportedCampaigns = computed(
    () => new Set(this.donations().map((donation) => donation.campaignId)).size,
  );

  constructor() {
    this.donationService.getDonations().subscribe({
      next: (response) => {
        this.donations.set(response.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
  }
}
