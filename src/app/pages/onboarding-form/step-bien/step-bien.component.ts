import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-bien',
  templateUrl: './step-bien.component.html',
  styleUrls: ['./step-bien.component.scss'],
  imports: [FormsModule]
})

export class StepBienComponent {
  @Input() currentStep!: number;
  @Output() next = new EventEmitter<void>();

  bien = {
    nom: '',
    adresse: '',
    type: '',
  };

  onSubmit() {
    // Tu pourras plus tard envoyer les données à un service ou à l’API
    this.next.emit();
  }
}

