import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BauxComponent } from './pages/baux/baux.component';
import { BiensComponent } from './pages/biens/biens.component';
import { LocatairesComponent } from './pages/locataires/locataires.component';
import { LoyersComponent } from './pages/loyers/loyers.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { Settings } from 'lucide-angular';
import { SettingsComponent } from './pages/settings/settings.component';

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
            { path: 'dashboard', component: DashboardComponent },
            { path: 'bails', component: BauxComponent },
            { path: 'biens', component: BiensComponent },
            { path: 'locataires', component: LocatairesComponent },
            { path: 'loyers', component: LoyersComponent },
            { path: 'profil', component: ProfilComponent },
            { path: 'parametres', component: SettingsComponent },

        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
