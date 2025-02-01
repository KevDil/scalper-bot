import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasekingComponent } from './caseking.component';

describe('CasekingComponent', () => {
  let component: CasekingComponent;
  let fixture: ComponentFixture<CasekingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasekingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasekingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
