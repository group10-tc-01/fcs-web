import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";

import { API_CONFIG } from "@core/config/api.config";

export interface IDonation {
  id: string;
  campaignId: string;
  amount: number;
  status: string;
  createdAt: string;
  processedAt: string | null;
  failureReason: string | null;
}

export interface IDonationPage {
  items: IDonation[];
  page: number;
  pageSize: number;
  totalCount: number;
}

interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

@Injectable({ providedIn: "root" })
export class DonationService {
  private readonly httpClient = inject(HttpClient);

  getDonations(): Observable<IDonationPage> {
    return this.httpClient
      .get<
        IApiResponse<IDonationPage>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/donations`, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  createDonation(campaignId: string, amount: number): Observable<IDonation> {
    return this.httpClient
      .post<
        IApiResponse<IDonation>
      >(`${API_CONFIG.bffBaseUrl}/api/v1/donations`, { campaignId, amount }, { withCredentials: true })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  private unwrapResponse<T>(response: IApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message ?? "Unexpected API response.");
    }

    return response.data;
  }
}
