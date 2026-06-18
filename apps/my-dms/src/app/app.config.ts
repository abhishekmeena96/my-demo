import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom  } from '@angular/core';
import { appRoutes } from './app.routes';
import { CoreModule } from '@alfresco/adf-core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAppConfig, provideCoreAuth, provideI18N } from '@alfresco/adf-core';

import { SHELL_APP_SERVICE, SHELL_AUTH_TOKEN, provideShellRoutes } from '@alfresco/adf-core/shell';
import { AuthGuard } from '@alfresco/adf-core';
import { of } from 'rxjs'
import { SHELL_ROUTES } from './shell.routes';



export const appConfig: ApplicationConfig = {
   providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideCoreAuth({ useHash: true }),
    provideAppConfig(),
    provideI18N({
      assets: [['app', 'assets']]
    }),
    provideRouter(appRoutes, withHashLocation()),
    provideShellRoutes(SHELL_ROUTES),
    {
      provide: SHELL_AUTH_TOKEN,
      useValue: AuthGuard
    },
    {
      provide: SHELL_APP_SERVICE,
      useValue: {
        ready$: of(true)
      }
    }

  ]
};
