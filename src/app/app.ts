import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { FooterComponent } from "@shared/componentes/footer/footer.component";
import { HeaderComponent } from "@shared/componentes/header/header.component";

@Component({
  selector: "fcs-root",
  imports: [FooterComponent, HeaderComponent, RouterOutlet, ToastModule],
  templateUrl: "./app.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = "fcs-web";
}
