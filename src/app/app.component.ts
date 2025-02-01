import { Component} from '@angular/core';
import { FoundersEditionComponent } from './shops/founders-edition/founders-edition.component';
import { AlternateComponent } from "./shops/alternate/alternate.component";
import { CasekingComponent } from "./shops/caseking/caseking.component";
import { MsiComponent } from './shops/msi/msi.component';
import { AmazonComponent } from "./shops/amazon/amazon.component";
import { AlzaComponent } from "./shops/alza/alza.component";

@Component({
  selector: 'app-root',
  imports: [FoundersEditionComponent, AlternateComponent, CasekingComponent, MsiComponent, AmazonComponent, AlzaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scalper-bot';
}
