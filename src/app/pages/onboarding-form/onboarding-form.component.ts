import { Component } from '@angular/core';
import { StepBienComponent } from './step-bien/step-bien.component';
import { StepBailComponent } from './step-bail/step-bail.component';
import { StepLocataireComponent } from './step-locataire/step-locataire.component';
import { StepZeroComponent } from './step-zero/step-zero.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding-form',
  templateUrl: './onboarding-form.component.html',
  styleUrls: ['./onboarding-form.component.scss'],
  imports: [StepBienComponent, StepBailComponent, StepLocataireComponent, CommonModule, StepZeroComponent]
})

export class OnboardingFormComponent {
  currentStep = 0;
  hasProperty: boolean = false;

  handleStepZeroNext(hasProperty: boolean) {
    this.hasProperty = hasProperty;
    this.currentStep = 1;
  }

  goToNextStep() {
    if (this.currentStep === 1 && !this.hasProperty) {
      this.currentStep = 2; // Go to bail directly
    } else {
      this.currentStep++;
    }
  }

  finishOnboarding() {
    // Finalisation logique : sauvegarde, redirection, etc.
    console.log('Onboarding terminé !');
  }

  getProgressPercentage(): number {
    const totalSteps = this.hasProperty ? 4 : 3;
    return (this.currentStep / (totalSteps - 1)) * 100;
  }
}

