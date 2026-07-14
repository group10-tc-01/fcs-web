import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { finalize } from "rxjs";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { MessageModule } from "primeng/message";

import {
  CampaignService,
  ICampaign,
  ICampaignInput,
} from "@features/campaigns/services/campaign.service";
import { NotificationService } from "@core/services/notification.service";

@Component({
  selector: "fcs-campaign-management-page",
  imports: [ButtonModule, DatePickerModule, MessageModule, ReactiveFormsModule],
  templateUrl: "./campaign-management-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignManagementPageComponent {
  private readonly campaignService = inject(CampaignService);
  private readonly notificationService = inject(NotificationService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly campaigns = signal<ICampaign[]>([]);
  protected readonly selectedCampaignId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal("");
  protected readonly selectedCampaign = computed(() =>
    this.campaigns().find((campaign) => campaign.id === this.selectedCampaignId()),
  );
  protected readonly campaignForm = this.formBuilder.group(
    {
      title: ["", [Validators.required, Validators.maxLength(200)]],
      description: ["", [Validators.required, Validators.maxLength(2000)]],
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
      financialGoal: [0, [Validators.required, Validators.min(1)]],
    },
    { validators: endDateAfterStartDate },
  );

  constructor() {
    this.loadCampaigns();
  }

  protected submit(): void {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    const campaign = this.selectedCampaign();
    const request = this.toRequest();
    this.submitting.set(true);
    const action = campaign
      ? this.campaignService.updateCampaign(campaign.id, request)
      : this.campaignService.createCampaign(request);

    action.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.notificationService.success(
          campaign ? "Campanha atualizada" : "Campanha criada",
          "As informações foram salvas com sucesso.",
        );
        this.resetForm();
        this.loadCampaigns();
      },
      error: () => this.errorMessage.set("Não foi possível salvar a campanha."),
    });
  }

  protected edit(campaign: ICampaign): void {
    this.selectedCampaignId.set(campaign.id);
    this.campaignForm.setValue({
      title: campaign.title,
      description: campaign.description,
      startDate: this.toDate(campaign.startDate),
      endDate: this.toDate(campaign.endDate),
      financialGoal: campaign.financialGoal,
    });
  }

  protected cancelEdit(): void {
    this.resetForm();
  }

  protected changeStatus(campaign: ICampaign, status: "Completed" | "Canceled"): void {
    this.campaignService.updateStatus(campaign.id, status).subscribe({
      next: () => {
        this.notificationService.success("Status atualizado", "A campanha foi atualizada.");
        this.loadCampaigns();
      },
      error: () => this.errorMessage.set("Não foi possível atualizar o status da campanha."),
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

  protected minimumEndDate(): Date | null {
    const startDate = this.campaignForm.controls.startDate.value;
    if (startDate === null) {
      return null;
    }

    return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
  }

  private loadCampaigns(): void {
    this.loading.set(true);
    this.errorMessage.set("");
    this.campaignService.getCampaigns().subscribe({
      next: (response) => {
        this.campaigns.set(response.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Não foi possível carregar as campanhas.");
        this.loading.set(false);
      },
    });
  }

  private resetForm(): void {
    this.selectedCampaignId.set(null);
    this.campaignForm.reset({
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      financialGoal: 0,
    });
  }

  private toRequest(): ICampaignInput {
    const value = this.campaignForm.getRawValue();
    return {
      ...value,
      startDate: value.startDate!.toISOString(),
      endDate: value.endDate!.toISOString(),
    };
  }

  private toDate(value: string): Date | null {
    return value ? new Date(value) : null;
  }
}

function endDateAfterStartDate(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get("startDate")?.value;
  const endDate = control.get("endDate")?.value;

  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return null;
  }

  return endDate.getTime() > startDate.getTime() ? null : { endDateBeforeStartDate: true };
}
