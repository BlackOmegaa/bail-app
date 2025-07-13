import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocataireModalComponent } from './locataire-modal.component';

describe('LocataireModalComponent', () => {
  let component: LocataireModalComponent;
  let fixture: ComponentFixture<LocataireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocataireModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocataireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
