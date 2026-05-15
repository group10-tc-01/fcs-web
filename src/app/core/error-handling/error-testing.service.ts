import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorTestingService {
  private readonly httpClient = inject(HttpClient);

  simulateHttpError(status: number): Observable<unknown> {
    return this.httpClient.get<unknown>(`/__error-test/${status}`);
  }
}
