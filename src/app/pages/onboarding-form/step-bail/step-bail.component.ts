import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-bail',
  templateUrl: './step-bail.component.html',
  styleUrls: ['./step-bail.component.scss'],
  imports: [FormsModule]
})

export class StepBailComponent {
  @Output() next = new EventEmitter<void>();

  bail = {
    debut: '',
    fin: '',
    loyer: null,
    charges: null,
    depot: null,
    modePaiement: '',
  };

  onSubmit() {
    // Logique d’enregistrement à ajouter ici plus tard
    this.next.emit();
  }
}
