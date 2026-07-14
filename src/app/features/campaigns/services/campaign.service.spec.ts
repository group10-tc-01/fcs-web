import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { API_CONFIG } from "@core/config/api.config";
import { CampaignService, ITransparencyCampaign } from "./campaign.service";

describe("CampaignService", () => {
  let campaignService: CampaignService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    campaignService = TestBed.inject(CampaignService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should return the items from a paginated transparency response", () => {
    const campaign: ITransparencyCampaign = {
      title: "Campanha de inverno",
      financialGoal: 1000,
      totalAmountRaised: 250,
    };
    let result: ITransparencyCampaign[] | undefined;

    campaignService.getTransparencyCampaigns().subscribe((value) => {
      result = value;
    });

    httpTestingController
      .expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/transparency/campaigns`)
      .flush({
        success: true,
        data: {
          items: [campaign],
          page: 1,
          pageSize: 10,
          totalCount: 1,
        },
        message: null,
      });

    expect(result).toEqual([campaign]);
  });
});
