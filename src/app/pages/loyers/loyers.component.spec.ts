import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyersComponent } from './loyers.component';

describe('LoyersComponent', () => {
  let component: LoyersComponent;
  let fixture: ComponentFixture<LoyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
