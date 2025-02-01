import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundersEditionComponent } from './founders-edition.component';

describe('FoundersEditionComponent', () => {
  let component: FoundersEditionComponent;
  let fixture: ComponentFixture<FoundersEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundersEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundersEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
