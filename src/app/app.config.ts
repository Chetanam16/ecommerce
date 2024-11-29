import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [ provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideAnimations(),provideAnimationsAsync(),provideToastr(),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),]
};
