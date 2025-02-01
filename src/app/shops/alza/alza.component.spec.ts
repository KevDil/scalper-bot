import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlzaComponent } from './alza.component';

describe('AlzaComponent', () => {
  let component: AlzaComponent;
  let fixture: ComponentFixture<AlzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlzaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
