import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "fcg-root",
  imports: [RouterOutlet],
  templateUrl: "./app.html",
})
export class AppComponent {
  protected readonly title = signal("fcg-solidarity-web");
}
