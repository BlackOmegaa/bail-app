import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-zero',
  templateUrl: './step-zero.component.html',
  styleUrls: ['./step-zero.component.scss'],
  imports: [FormsModule]
})

export class StepZeroComponent {
  @Output() next = new EventEmitter<boolean>();
  selected: boolean | null = null;

  select(value: boolean) {
    this.selected = value;
  }

  validate() {
    if (this.selected !== null) {
      this.next.emit(this.selected);
    }
  }
}