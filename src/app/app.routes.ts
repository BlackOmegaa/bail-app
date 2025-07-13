import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BauxComponent } from './pages/baux/baux.component';
import { BiensComponent } from './pages/biens/biens.component';
import { LocatairesComponent } from './pages/locataires/locataires.component';
import { LoyersComponent } from './pages/loyers/loyers.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { Ban, Settings } from 'lucide-angular';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { noAuthGuard } from './core/guard/no-auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guard/auth.guard';
import { OnboardingFormComponent } from './pages/onboarding-form/onboarding-form.component';
import { BankConnectionComponent } from './pages/bank-connection/bank-connection.component';
import { BankSuccessComponent } from './pages/bank-success/bank-success.component';
import { BankAccountsComponent } from './pages/bank-accounts/bank-accounts.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: DashboardLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
            { path: 'bails', component: BauxComponent, canActivate: [authGuard] },
            { path: 'biens', component: BiensComponent, canActivate: [authGuard] },
            { path: 'locataires', component: LocatairesComponent, canActivate: [authGuard] },
            { path: 'loyers', component: LoyersComponent, canActivate: [authGuard] },
            { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },
            { path: 'parametres', component: SettingsComponent, canActivate: [authGuard] },
            { path: 'bank-connection', component: BankConnectionComponent, canActivate: [authGuard] },
            { path: 'bank-success', component: BankSuccessComponent, canActivate: [authGuard] },
            { path: 'bank-accounts', component: BankAccountsComponent, canActivate: [authGuard] }
        ]
    },

    { path: 'onboarding', component: OnboardingFormComponent },
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },

    { path: '**', redirectTo: 'dashboard' }
];
