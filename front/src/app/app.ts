import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationStart, Router, RouterOutlet, Scroll } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ContactDialog } from './components/contact-dialog/contact-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ContactDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Changement de page : on remonte d'un coup. Sans cela, le
        // défilement fluide ferait défiler toute la page d'accueil avant
        // d'afficher la fiche projet.
        if (!event.url.includes('#')) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        return;
      }

      // Ancre du menu (#projects, #skills…) : le routeur fait défiler la
      // page, mais le focus resterait sur le lien. On le pose sur la cible,
      // pour que le Tab suivant parte de la section et qu'un lecteur
      // d'écran l'annonce.
      if (event instanceof Scroll && event.anchor && typeof requestAnimationFrame === 'function') {
        const anchor = event.anchor;
        requestAnimationFrame(() => {
          const target = document.getElementById(anchor);
          if (!target) {
            return;
          }
          if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
          }
          target.focus({ preventScroll: true });
        });
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
