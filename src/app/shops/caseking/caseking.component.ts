import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MP3_URL } from '../../constants/shared-constants';
import { URLS } from '../../constants/caseking-constants';

@Component({
  selector: 'app-caseking',
  imports: [CommonModule],
  templateUrl: './caseking.component.html',
  styleUrl: './caseking.component.scss',
})
export class CasekingComponent implements OnInit {
  private destroy$ = new Subject<void>();
  isActive: boolean = false;
  detectedGpus: { [key: string]: boolean } = {};

  ngOnInit(): void {
    interval(30000) // Alle 30 Sekunden
          .pipe(
            takeUntil(this.destroy$), // Stoppt den Stream, wenn die Komponente zerstört wird
            filter(() => this.isActive) // Führt fetchData() nur aus, wenn isActive == true
          )
          .subscribe(async () => await this.fetchData());
  }

  async fetchData(): Promise<void> {
    try {
      const response = await fetch('/api/caseking');
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      data.forEach((item: { name: string; available: boolean; }) => {
        console.log(`Caseking: ${item.name} verfügbar:`, item.available);
        if (item.available) {
          this.detectedGpus[item.name] = true;  // Dynamisch die `detected` Variable setzen
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