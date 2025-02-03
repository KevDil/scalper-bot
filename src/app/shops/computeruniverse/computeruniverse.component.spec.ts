import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputeruniverseComponent } from './computeruniverse.component';

describe('ComputeruniverseComponent', () => {
  let component: ComputeruniverseComponent;
  let fixture: ComponentFixture<ComputeruniverseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputeruniverseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputeruniverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
