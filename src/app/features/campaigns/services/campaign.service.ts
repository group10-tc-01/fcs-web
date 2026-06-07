import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";

import { API_CONFIG } from "@core/config/api.config";

export interface ITransparencyCampaign {
  title: string;
  financialGoal: number;
  totalAmountRaised: number;
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
      >(`${API_CONFIG.campaignBaseUrl}/api/v1/transparency/campaigns`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  private unwrapResponse<T>(response: IApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message ?? "Unexpected API response.");
    }

    return response.data;
  }
}
