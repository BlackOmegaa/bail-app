import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mon-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfilComponent implements OnInit {
  user: any;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  showPasswordModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.auth.getUserProfile().subscribe(user => {
      this.user = user;
      this.profileForm = this.fb.group({
        name: [user.name, Validators.required],
        email: [user.email, [Validators.required, Validators.email]]
      });

      this.passwordForm = this.fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]]
      });
    });
  }

  updateProfile() {
    this.auth.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Profil mis à jour.';
        const r: any = res;
        this.user = r.user;
        localStorage.setItem('token', r.token);

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => this.errorMessage = 'Erreur lors de la mise à jour.'
    });
  }

  updatePassword() {
    this.auth.updatePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        const r: any = res;
        this.successMessage = r.message;
        this.showPasswordModal = false;
        this.passwordForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }
}
