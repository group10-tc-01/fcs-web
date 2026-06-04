import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { HeaderComponent } from "@shared/componentes/header/header.component";

@Component({
  selector: "fcg-root",
  imports: [ButtonModule, HeaderComponent, RouterLink, RouterOutlet, ToastModule],
  templateUrl: "./app.html",
})
export class AppComponent {
  protected readonly title = "fcg-solidarity-web";
}
