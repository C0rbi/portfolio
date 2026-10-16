import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMAIL } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';
import { LagoonFloor } from '../../decor/lagoon-floor/lagoon-floor';
import { ContactDialogService } from '../../shared/contact-dialog.service';

interface ContactLink {
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly external: boolean;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RevealDirective, LagoonFloor],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly email = EMAIL;
  /** « Écrire un message » ouvre la même fenêtre que « Me contacter ». */
  protected readonly contact = inject(ContactDialogService);

  protected readonly links: readonly ContactLink[] = [
    {
      label: 'Email',
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      external: false,
    },
    {
      label: 'LinkedIn',
      value: 'in/allannicolas',
      href: 'https://www.linkedin.com/in/allannicolas',
      external: true,
    },
    {
      label: 'GitHub',
      value: 'github.com/C0rbi',
      href: 'https://github.com/C0rbi',
      external: true,
    },
    {
      label: 'Curriculum vitæ',
      value: 'CV au format PDF',
      href: 'CV Allan NICOLAS, BTS SIO - SLAM.pdf',
      external: true,
    },
  ];

  /**
   * « Haut de page » remonte la page lue, quelle qu'elle soit : sur une
   * fiche projet, on reste sur la fiche au lieu d'être renvoyé à l'accueil.
   *
   * - Ctrl, Cmd, Maj ou clic du milieu : le lien garde son comportement
   *   natif (ouvrir ailleurs).
   * - Pas de `behavior` : le défilement suit le `scroll-behavior` CSS,
   *   donc instantané en mouvement réduit.
   * - Le focus passe sur `<main>`, sans re-défiler : le Tab suivant repart
   *   du début du contenu, et pas du bas de page.
   */
  protected toTop(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    window.scrollTo({ top: 0 });

    const main = document.getElementById('main');
    if (main) {
      // tabindex temporaire : retiré dès que le focus quitte <main>
      main.setAttribute('tabindex', '-1');
      main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
      main.focus({ preventScroll: true });
    }
  }
}
