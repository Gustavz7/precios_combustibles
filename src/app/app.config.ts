import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

//now in angular@17 the libraries is imported here
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync(),
  ]
};
