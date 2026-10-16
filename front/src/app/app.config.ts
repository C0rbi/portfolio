import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Les ancres du menu (#projects, #skills...) restent fonctionnelles
      // depuis n'importe quelle page.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
      // Les paramètres d'URL arrivent directement dans les `input()` du composant.
      withComponentInputBinding(),
    ),
    // Appels à l'API des messages (formulaire de contact, page /admin)
    provideHttpClient(withFetch()),
  ],
};
