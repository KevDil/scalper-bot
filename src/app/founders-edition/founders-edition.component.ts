import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-founders-edition',
  imports: [CommonModule],
  templateUrl: './founders-edition.component.html',
  styleUrl: './founders-edition.component.scss',
})
export class FoundersEditionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private url5080: string =
    'https://marketplace.nvidia.com/de-de/consumer/graphics-cards/?locale=de-de&page=1&limit=12&gpu=RTX%205080';
  private url5090: string =
    'https://marketplace.nvidia.com/de-de/consumer/graphics-cards/?locale=de-de&page=1&limit=12&gpu=RTX%205090';
  private mp3Url: string =
    'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';

  private detected5080: boolean = false;
  private detected5090: boolean = false;

  isActive: boolean = false;

  ngOnInit(): void {
    this.fetchData();

    interval(30000) // Alle 30 Sekunden
      .pipe(
        takeUntil(this.destroy$), // Stoppt den Stream, wenn die Komponente zerstört wird
        filter(() => this.isActive) // Führt fetchData() nur aus, wenn isActive == true
      )
      .subscribe(async () => await this.fetchData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async fetchData(): Promise<void> {
    try {
      const [data5080, data5090] = await Promise.all([
        this.fetchGpuData(
          'https://api.store.nvidia.com/partner/v1/feinventory?status=1&skus=PRO580GFTNV&locale=de-de'
        ),
        this.fetchGpuData(
          'https://api.store.nvidia.com/partner/v1/feinventory?status=1&skus=PROGFTNV590&locale=de-de'
        ),
      ]);

      if (data5080.success && !this.detected5080) {
        const isActive5080: boolean = data5080.listMap[0].is_active == 'true';
        console.log('RTX 5080 verfügbar:', isActive5080);
        if (isActive5080) {
          this.detected5080 = true;
          this.alertUser();
          window.open(this.url5080, '_blank');
        }
      }

      if (
        data5090.success &&
        data5090.listMap[0].is_active &&
        !this.detected5090
      ) {
        const isActive5090: boolean = data5090.listMap[0].is_active == 'true';
        console.log('RTX 5090 verfügbar:', isActive5090);
        if (isActive5090) {
          this.detected5090 = true;
          this.alertUser();
          window.open(this.url5090, '_blank');
        }
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  }

  private async fetchGpuData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  private alertUser(): void {
    const audio = new Audio(this.mp3Url);
    audio
      .play()
      .catch((err) => console.error('Fehler beim Abspielen des Sounds:', err));
    //alert('Eine GPU ist verfügbar!');
  }

  toggleButton(): void {
    this.isActive = !this.isActive;
  }
}
