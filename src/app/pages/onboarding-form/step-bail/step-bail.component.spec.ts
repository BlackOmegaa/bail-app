import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBailComponent } from './step-bail.component';

describe('StepBailComponent', () => {
  let component: StepBailComponent;
  let fixture: ComponentFixture<StepBailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
