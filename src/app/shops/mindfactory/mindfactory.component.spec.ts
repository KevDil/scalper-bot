import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MindfactoryComponent } from './mindfactory.component';

describe('MindfactoryComponent', () => {
  let component: MindfactoryComponent;
  let fixture: ComponentFixture<MindfactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MindfactoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MindfactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
