import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Révèle un élément lorsqu'il entre dans le viewport.
 *
 * La directive se contente de poser les classes `reveal` puis `is-revealed` :
 * toute l'animation est décrite en SCSS (voir `styles/_animations.scss`),
 * ce qui garde le rendu fluide.
 *
 * - Animations non permises (`prefers-reduced-motion`, sauf « Animer le
 *   lagon ») : `is-revealed` est posée tout de suite, sans observer. Rien
 *   n'attend le défilement pour apparaître.
 * - Sinon, l'élément est révélé dès que son haut entre dans les 88 %
 *   supérieurs de l'écran (`threshold: 0`), quelle que soit sa hauteur :
 *   un bloc plus haut que l'écran (zoom fort, petit viewport) apparaît
 *   lui aussi.
 *
 * Usage : `<div appReveal [revealDelay]="120">`
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Décalage en millisecondes, pour animer une liste en cascade. */
  readonly revealDelay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    element.classList.add('reveal');

    const delay = this.revealDelay();
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}ms`);
    }

    // Mouvement réduit, ou navigateur sans IntersectionObserver : on affiche
    // tout de suite, le contenu reste accessible quoi qu'il arrive.
    if (!this.motion.animate() || typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          entry.target.classList.add('is-revealed');
          this.observer?.unobserve(entry.target);
        }
      },
      // Seuil 0 : le moindre pixel visible suffit, même pour un bloc très haut.
      // La marge basse retarde un peu l'apparition pour qu'elle se voie.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
