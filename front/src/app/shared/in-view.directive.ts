import { Directive, ElementRef, OnDestroy, OnInit, inject, input, signal } from '@angular/core';

/**
 * Indique si l'hôte est à l'écran (classe `is-inview`, qui bascule) et s'il
 * l'a déjà été (classe `is-seen`, définitive). Les décors s'en servent pour
 * mettre leurs animations en pause hors écran (voir `_animations.scss`).
 *
 * Usage : `hostDirectives: [InViewDirective]` dans un composant de décor,
 * ou `<div appInView>` dans un gabarit.
 *
 * Un hôte de hauteur nulle (un intermède) est bien observé : une cible
 * d'aire nulle est « intersectante » dès qu'elle touche la zone observée.
 */
@Directive({
  selector: '[appInView]',
  host: { '[class.is-inview]': 'inView()', '[class.is-seen]': 'seen()' },
})
export class InViewDirective implements OnInit, OnDestroy {
  /** Marge d'observation : le décor s'anime un peu avant d'entrer à l'écran. */
  readonly inViewMargin = input('20% 0px');

  /** Vrai tant que l'hôte est (presque) visible. */
  readonly inView = signal(false);

  /** Passe à vrai à la première apparition, et le reste. */
  readonly seen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // Sans IntersectionObserver (jsdom, très vieux navigateurs), on considère
    // l'hôte comme visible : le décor reste complet, simplement jamais en pause.
    if (typeof IntersectionObserver === 'undefined') {
      this.inView.set(true);
      this.seen.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        // Plusieurs entrées peuvent arriver d'un coup : la dernière fait foi.
        const entry = entries[entries.length - 1];
        if (!entry) {
          return;
        }
        this.inView.set(entry.isIntersecting);
        if (entry.isIntersecting) {
          this.seen.set(true);
        }
      },
      { rootMargin: this.inViewMargin() },
    );

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
