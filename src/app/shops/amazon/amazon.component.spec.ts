import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonComponent } from './amazon.component';

describe('AmazonComponent', () => {
  let component: AmazonComponent;
  let fixture: ComponentFixture<AmazonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmazonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
