import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthInterceptor } from './app/core/interceptor/auth.interceptor';

import { provideNativeDateAdapter } from '@angular/material/core';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideNativeDateAdapter(),

  ]
});
