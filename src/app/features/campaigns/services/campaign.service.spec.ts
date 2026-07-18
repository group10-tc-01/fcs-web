import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { API_CONFIG } from "@core/config/api.config";
import {
  CampaignService,
  ICampaign,
  ICampaignInput,
  ICampaignPage,
  ITransparencyCampaign,
} from "./campaign.service";

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

  it("should retrieve active campaigns with credentials", () => {
    let result: ICampaignPage | undefined;

    campaignService.getActiveCampaigns().subscribe((value) => {
      result = value;
    });

    const request = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/campaigns/active`,
    );
    expect(request.request.method).toBe("GET");
    expect(request.request.withCredentials).toBe(true);
    request.flush(apiResponse(campaignPage));

    expect(result).toEqual(campaignPage);
  });

  it("should retrieve all campaigns with credentials", () => {
    let result: ICampaignPage | undefined;

    campaignService.getCampaigns().subscribe((value) => {
      result = value;
    });

    const request = httpTestingController.expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`);
    expect(request.request.method).toBe("GET");
    expect(request.request.withCredentials).toBe(true);
    request.flush(apiResponse(campaignPage));

    expect(result).toEqual(campaignPage);
  });

  it("should create and update a campaign", () => {
    const input: ICampaignInput = {
      title: "Campanha de inverno",
      description: "Arrecadação para o inverno.",
      startDate: "2026-07-01",
      endDate: "2026-08-01",
      financialGoal: 1000,
    };
    const results: ICampaign[] = [];

    campaignService.createCampaign(input).subscribe((value) => results.push(value));

    const createRequest = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/campaigns`,
    );
    expect(createRequest.request.method).toBe("POST");
    expect(createRequest.request.withCredentials).toBe(true);
    expect(createRequest.request.body).toEqual(input);
    createRequest.flush(apiResponse(campaign));

    campaignService.updateCampaign(campaign.id, input).subscribe((value) => results.push(value));

    const updateRequest = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/campaigns/${campaign.id}`,
    );
    expect(updateRequest.request.method).toBe("PUT");
    expect(updateRequest.request.withCredentials).toBe(true);
    expect(updateRequest.request.body).toEqual(input);
    updateRequest.flush(apiResponse(campaign));

    expect(results).toEqual([campaign, campaign]);
  });

  it("should update a campaign status", () => {
    let result: ICampaign | undefined;

    campaignService.updateStatus(campaign.id, "Closed").subscribe((value) => {
      result = value;
    });

    const request = httpTestingController.expectOne(
      `${API_CONFIG.bffBaseUrl}/api/v1/campaigns/${campaign.id}/status`,
    );
    expect(request.request.method).toBe("PATCH");
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.body).toEqual({ status: "Closed" });
    request.flush(apiResponse(campaign));

    expect(result).toEqual(campaign);
  });

  it("should reject an unsuccessful API response", () => {
    let error: Error | undefined;

    campaignService.getCampaigns().subscribe({
      error: (value: Error) => {
        error = value;
      },
    });

    httpTestingController
      .expectOne(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`)
      .flush({ success: false, data: null, message: "Unable to retrieve campaigns." });

    expect(error?.message).toBe("Unable to retrieve campaigns.");
  });

  const campaign: ICampaign = {
    id: "campaign-id",
    title: "Campanha de inverno",
    description: "Arrecadação para o inverno.",
    startDate: "2026-07-01",
    endDate: "2026-08-01",
    financialGoal: 1000,
    totalAmountRaised: 250,
    status: "Active",
  };
  const campaignPage: ICampaignPage = {
    items: [campaign],
    page: 1,
    pageSize: 10,
    totalCount: 1,
  };

  function apiResponse<T>(data: T): { success: true; data: T; message: null } {
    return { success: true, data, message: null };
  }
});
