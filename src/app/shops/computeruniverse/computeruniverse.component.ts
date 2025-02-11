import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { URLS, APIS } from '../../constants/computeruniverse-constants';
import { MP3_URL, TIME_INTERVAL } from '../../constants/shared-constants';

@Component({
  selector: 'app-computeruniverse',
  imports: [CommonModule],
  templateUrl: './computeruniverse.component.html',
  styleUrl: './computeruniverse.component.scss',
})
export class ComputeruniverseComponent implements OnInit, OnDestroy {
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
      // Erstelle eine Liste von API- und URL-Keys
      const keys = Object.keys(APIS) as (keyof typeof APIS)[];

      // Iteriere über alle Keys und hole die Daten
      for (let key of keys) {
        const apiUrl = APIS[key];
        const url = URLS[key];

        // Hole die GPU-Daten für jedes API
        const data = await this.fetchGpuData(apiUrl);

        // Überprüfe den Erfolg der Daten und ob die GPU bereits erkannt wurde
        const isAvailable: boolean = data.itemsData[0].in_stock === 'true';
        const changed = this.availableMap[key] != isAvailable;
        if (changed) {
          console.log(
            `Computeruniverse: ${key} verfügbar (${data.itemsData[0].stockquantity}):`,
            isAvailable
          );
          this.availableMap[key] = isAvailable; // Dynamisch die `detected` Variable setzen
        }
        if (isAvailable && changed) {
          this.alertUser();
          window.open(url, '_blank');
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
