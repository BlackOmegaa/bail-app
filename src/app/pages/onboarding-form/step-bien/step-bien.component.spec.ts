import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBienComponent } from './step-bien.component';

describe('StepBienComponent', () => {
  let component: StepBienComponent;
  let fixture: ComponentFixture<StepBienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
