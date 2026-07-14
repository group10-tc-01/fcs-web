import { TestBed } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { of } from "rxjs";

import { NotificationService } from "@core/services/notification.service";
import { CampaignService } from "@features/campaigns/services/campaign.service";
import { CampaignManagementPageComponent } from "./campaign-management-page.component";

describe("CampaignManagementPageComponent", () => {
  let component: CampaignManagementPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignManagementPageComponent],
      providers: [
        {
          provide: CampaignService,
          useValue: {
            getCampaigns: () => of({ items: [], page: 1, pageSize: 10, totalCount: 0 }),
          },
        },
        {
          provide: NotificationService,
          useValue: { success: () => undefined },
        },
      ],
    }).compileComponents();

    component = TestBed.createComponent(CampaignManagementPageComponent).componentInstance;
  });

  it("should require an end date after the start date", () => {
    const form = campaignForm();

    form.setValue({
      title: "Campanha de inverno",
      description: "Arrecadação para a campanha de inverno.",
      startDate: new Date(2026, 6, 15),
      endDate: new Date(2026, 6, 14),
      financialGoal: 1000,
    });

    expect(form.hasError("endDateBeforeStartDate")).toBe(true);
    expect(form.invalid).toBe(true);
  });

  it("should accept a title with up to 200 characters", () => {
    const title = "a".repeat(200);

    campaignForm().controls["title"].setValue(title);

    expect(campaignForm().controls["title"].hasError("maxlength")).toBe(false);
  });

  it("should reject a description longer than 2000 characters", () => {
    campaignForm().controls["description"].setValue("a".repeat(2001));

    expect(campaignForm().controls["description"].hasError("maxlength")).toBe(true);
  });

  function campaignForm(): FormGroup {
    return (component as unknown as { campaignForm: FormGroup }).campaignForm;
  }
});
