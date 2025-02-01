import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FoundersEditionComponent } from './founders-edition/founders-edition.component';

@Component({
  selector: 'app-root',
  imports: [FoundersEditionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scalper-bot';
}
