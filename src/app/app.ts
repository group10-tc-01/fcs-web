import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "fcg-root",
  imports: [RouterOutlet, ToastModule],
  templateUrl: "./app.html",
})
export class AppComponent {
  protected readonly title = "fcg-solidarity-web";
}
