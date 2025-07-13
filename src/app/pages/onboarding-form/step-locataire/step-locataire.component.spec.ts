import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLocataireComponent } from './step-locataire.component';

describe('StepLocataireComponent', () => {
  let component: StepLocataireComponent;
  let fixture: ComponentFixture<StepLocataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLocataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
