import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MP3_URL, TIME_INTERVAL } from '../../constants/shared-constants';
import { URLS } from '../../constants/amazon-constants';

@Component({
  selector: 'app-amazon',
  imports: [CommonModule],
  templateUrl: './amazon.component.html',
  styleUrl: './amazon.component.scss',
})
export class AmazonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isActive: boolean = false;
  availableMap: { [key: string]: boolean } = {};

  ngOnInit(): void {
    interval(TIME_INTERVAL) // Alle 30 Sekunden
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
      const response = await fetch('/api/amazon');
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      data.forEach((item: { name: string; available: boolean }) => {
        const changed = this.availableMap[item.name] != item.available;
        if (changed) {
          console.log(`Amazon: ${item.name} verfügbar:`, item.available);
          this.availableMap[item.name] = item.available; // Dynamisch die `detected` Variable setzen
        }
        if (item.available && changed) {
          this.alertUser();
          const url = URLS[item.name as keyof typeof URLS];
          window.open(url, '_blank');
        }
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der API:', error);
    }
  }

  private alertUser(): void {
    const audio = new Audio(MP3_URL);
    audio
      .play()
      .catch((err) => console.error('Fehler beim Abspielen des Sounds:', err));
    //alert('Eine GPU ist verfügbar!');
  }

  toggleButton(): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.fetchData();
    }
  }
}
/*fetch('/api/amazon')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));*/
