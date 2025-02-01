import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

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
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      const response = await fetch('/api/alternate');
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Verfügbar: ', data.available);
    } catch (error) {
      console.error('Fehler beim Abrufen der API:', error);
    }
  }

  toggleButton(): void {
    this.isActive = !this.isActive;
  }
}
    /*fetch('/api/alternate')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));*/