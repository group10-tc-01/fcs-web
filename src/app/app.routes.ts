import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";
import { guestGuard } from "@core/guards/guest.guard";
import { managerGuard } from "@core/guards/manager.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/home/pages/home-page/home-page.component").then(
        (component) => component.HomePageComponent,
      ),
  },
  {
    path: "sobre",
    loadComponent: () =>
      import("./features/about/pages/about-page/about-page.component").then(
        (component) => component.AboutPageComponent,
      ),
  },
  {
    path: "cadastro",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./features/auth/pages/register-page/register-page.component").then(
        (component) => component.RegisterPageComponent,
      ),
  },
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./features/auth/pages/login-page/login-page.component").then(
        (component) => component.LoginPageComponent,
      ),
  },
  {
    path: "campanhas",
    loadComponent: () =>
      import("./features/campaigns/pages/campaigns-page/campaigns-page.component").then(
        (component) => component.CampaignsPageComponent,
      ),
  },
  {
    path: "transparencia",
    redirectTo: "campanhas",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/dashboard/pages/dashboard-page/dashboard-page.component").then(
        (component) => component.DashboardPageComponent,
      ),
  },
  {
    path: "doacoes",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/donations/pages/donations-page/donations-page.component").then(
        (component) => component.DonationsPageComponent,
      ),
  },
  {
    path: "gestao/campanhas",
    canActivate: [managerGuard],
    loadComponent: () =>
      import("./features/campaigns/pages/campaign-management-page/campaign-management-page.component").then(
        (component) => component.CampaignManagementPageComponent,
      ),
  },
  { path: "**", redirectTo: "" },
];
