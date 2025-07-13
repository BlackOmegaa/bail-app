import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  token = '';
  showPassword: boolean = false;


  constructor(private auth: AuthService, private router: Router) { }

  errorMessage = '';

  onRegister(): void {
    this.errorMessage = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      setTimeout(() => this.hideToast('error'), 3000);

      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Adresse email invalide.';
      setTimeout(() => this.hideToast('error'), 3000);

      return;
    }

    if (!this.isStrongPassword(this.password)) {
      this.errorMessage =
        'Mot de passe trop faible. (8+ caractères, 1 majuscule, 1 chiffre)';
      setTimeout(() => this.hideToast('error'), 3000);

      return;
    }

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          state: { message: 'Votre compte a été créé avec succès.' }
        });

      },
      error: (err) => {
        const backendMsg = err?.error?.message;
        this.errorMessage = backendMsg || 'Erreur lors de l’inscription.';
        setTimeout(() => this.hideToast('error'), 3000);

      },
    });
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  hideToast(selector: 'error') {
    const el = document.querySelector(`.toast-container .toast-content.${selector}`);
    if (el) {
      el.classList.add('toast-exit');
      setTimeout(() => {
        this.errorMessage = '';
      }, 400);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/api/auth/google'; // ou ton URL d'auth Google
  }

}
