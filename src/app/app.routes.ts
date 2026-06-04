import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";
import { guestGuard } from "@core/guards/guest.guard";

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
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/dashboard/pages/dashboard-page/dashboard-page.component").then(
        (component) => component.DashboardPageComponent,
      ),
  },
];
