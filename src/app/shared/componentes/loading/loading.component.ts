import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "fcs-loading",
  templateUrl: "./loading.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  readonly label = input("Carregando...");
}
