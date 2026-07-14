import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";

import { CampaignService, ICampaign } from "@features/campaigns/services/campaign.service";
import { DonationService, IDonation } from "@features/donations/services/donation.service";
import { NotificationService } from "@core/services/notification.service";

@Component({
  selector: "fcs-donations-page",
  imports: [ButtonModule, MessageModule, ReactiveFormsModule],
  templateUrl: "./donations-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationsPageComponent {
  private readonly campaignService = inject(CampaignService);
  private readonly donationService = inject(DonationService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly notificationService = inject(NotificationService);

  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal("");
  protected readonly campaigns = signal<ICampaign[]>([]);
  protected readonly donations = signal<IDonation[]>([]);
  protected readonly totalDonated = computed(() =>
    this.donations().reduce((total, donation) => total + donation.amount, 0),
  );
  protected readonly donationForm = this.formBuilder.group({
    campaignId: ["", Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.load();
  }

  protected submit(): void {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    const value = this.donationForm.getRawValue();
    this.submitting.set(true);
    this.donationService
      .createDonation(value.campaignId, value.amount)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            "Intenção registrada",
            "Sua doação será processada em instantes.",
          );
          this.donationForm.reset({ campaignId: "", amount: 0 });
          this.loadDonations();
        },
        error: () => this.errorMessage.set("Não foi possível registrar a doação."),
      });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(value),
    );
  }

  private load(): void {
    this.loading.set(true);
    this.errorMessage.set("");
    this.campaignService.getActiveCampaigns().subscribe({
      next: (response) => {
        this.campaigns.set(response.items);
        this.loadDonations();
      },
      error: () => {
        this.errorMessage.set("Não foi possível carregar campanhas elegíveis.");
        this.loading.set(false);
      },
    });
  }

  private loadDonations(): void {
    this.donationService.getDonations().subscribe({
      next: (response) => {
        this.donations.set(response.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Não foi possível carregar seu histórico de doações.");
        this.loading.set(false);
      },
    });
  }
}
