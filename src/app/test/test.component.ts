import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  text = 'Nicht verfügbar';

  ngOnInit(): void {
    interval(30000) // Alle 30 Sekunden
      .pipe(
        takeUntil(this.destroy$) // Führt fetchData() nur aus, wenn isActive == true
      )
      .subscribe(() => this.switchText());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchText(): void {
    this.text =
      this.text === 'Nicht verfügbar' ? 'Auf Lager' : 'Nicht verfügbar';
  }
}
