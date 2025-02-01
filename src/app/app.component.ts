import { Component} from '@angular/core';
import { FoundersEditionComponent } from './shops/founders-edition/founders-edition.component';
import { AlternateComponent } from "./shops/alternate/alternate.component";

@Component({
  selector: 'app-root',
  imports: [FoundersEditionComponent, AlternateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scalper-bot';
}
