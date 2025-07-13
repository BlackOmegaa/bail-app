import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const message = history.state?.message;

    if (message) {
      this.successMessage = message;
      history.replaceState({}, '', window.location.pathname);
      setTimeout(() => this.hideToast('success'), 3000);
    }


  }

  toastKey = 0;

  showError(message: string) {
    this.errorMessage = message;
    this.toastKey++;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3200);
  }



  onLogin(): void {
    if (!this.email || !this.password) {
      this.showError('Veuillez remplir tous les champs.');

      setTimeout(() => this.hideToast('error'), 3000);
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

        this.router.navigate(['/home'], {
          state: { message: 'Bienvenue, vous êtes connecté !' }
        });
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.errorMessage =
          backendMessage === 'Email ou mot de passe incorrect.'
            ? backendMessage
            : this.showError('Veuillez remplir tous les champs.');
        this.showError(this.errorMessage);

        setTimeout(() => this.hideToast('error'), 3000);
      },
    });
  }

  hideToast(type: 'success' | 'error') {
    const el = document.getElementById(
      type === 'success' ? 'toast-success' : 'toast-error'
    );

    if (el) {
      el.classList.add('toast-exit');

      setTimeout(() => {
        if (type === 'success') this.successMessage = '';
        if (type === 'error') this.errorMessage = '';
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
