import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { AuthService } from "@features/auth/services/auth.service";
import { DonorDashboardComponent } from "@features/dashboard/components/donor-dashboard/donor-dashboard.component";
import { ManagerDashboardComponent } from "@features/dashboard/components/manager-dashboard/manager-dashboard.component";

@Component({
  selector: "fcs-dashboard-page",
  imports: [DonorDashboardComponent, ManagerDashboardComponent],
  templateUrl: "./dashboard-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly authService = inject(AuthService);
}
