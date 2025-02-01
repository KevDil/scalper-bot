import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-alternate',
  imports: [CommonModule],
  templateUrl: './alternate.component.html',
  styleUrl: './alternate.component.scss',
})
export class AlternateComponent implements OnInit {
  private destroy$ = new Subject<void>();
  isActive: boolean = false;

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
      const response = await fetch('/api/alternate');
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      data.forEach((item: { name: any; available: any; }) => {
        console.log(`Alternate: ${item.name} verfügbar:`, item.available);
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der API:', error);
    }
  }

  toggleButton(): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.fetchData();
    }
  }
}
    /*fetch('/api/alternate')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));*/