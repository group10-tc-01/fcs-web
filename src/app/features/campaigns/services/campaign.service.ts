import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";

import { API_CONFIG } from "@core/config/api.config";

export interface ITransparencyCampaign {
  title: string;
  financialGoal: number;
  totalAmountRaised: number;
}

export interface ICampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  financialGoal: number;
  totalAmountRaised: number;
  status: string;
}

export interface ICampaignPage {
  items: ICampaign[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ICampaignInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  financialGoal: number;
}

interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class CampaignService {
  private readonly httpClient = inject(HttpClient);

  getTransparencyCampaigns(): Observable<ITransparencyCampaign[]> {
    return this.httpClient
      .get<
        IApiResponse<ITransparencyCampaign[]>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/transparency/campaigns`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  getActiveCampaigns(): Observable<ICampaignPage> {
    return this.httpClient
      .get<
        IApiResponse<ICampaignPage>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns/active`, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  getCampaigns(): Observable<ICampaignPage> {
    return this.httpClient
      .get<
        IApiResponse<ICampaignPage>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  createCampaign(input: ICampaignInput): Observable<ICampaign> {
    return this.httpClient
      .post<
        IApiResponse<ICampaign>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns`, input, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  updateCampaign(id: string, input: ICampaignInput): Observable<ICampaign> {
    return this.httpClient
      .put<
        IApiResponse<ICampaign>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns/${id}`, input, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  updateStatus(id: string, status: string): Observable<ICampaign> {
    return this.httpClient
      .patch<
        IApiResponse<ICampaign>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/campaigns/${id}/status`, { status }, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  private unwrapResponse<T>(response: IApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message ?? "Unexpected API response.");
    }

    return response.data;
  }
}
