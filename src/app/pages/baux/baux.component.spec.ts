import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauxComponent } from './baux.component';

describe('BauxComponent', () => {
  let component: BauxComponent;
  let fixture: ComponentFixture<BauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BauxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
