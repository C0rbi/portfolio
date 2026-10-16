import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Compte de 0 jusqu'à la valeur cible quand l'élément devient visible.
 * Utilisé pour les chiffres clés de la page d'accueil. Sans animation
 * permise, ou en « Calme plat » (même activé après le chargement), la
 * valeur s'affiche directement.
 */
@Directive({
  selector: '[appCounter]',
})
export class CounterDirective implements OnInit, OnDestroy {
  /** Valeur finale affichée. */
  readonly appCounter = input.required<number>();
  /** Durée du comptage en millisecondes. */
  readonly counterDuration = input(1400);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;
  private frame = 0;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    const target = this.appCounter();

    // Aucune animation décorative (préférence système sans « Animer le lagon »,
    // ou « Calme plat ») : la valeur s'affiche directement.
    if (this.motion.calm() || typeof IntersectionObserver === 'undefined') {
      element.textContent = String(target);
      return;
    }

    element.textContent = '0';
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        this.observer?.disconnect();
        // « Calme plat » activé après le chargement : pas de comptage non plus.
        if (this.motion.calm()) {
          element.textContent = String(target);
          return;
        }
        this.run(element, target);
      },
      { threshold: 0.6 },
    );
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private run(element: HTMLElement, target: number): void {
    const duration = this.counterDuration();
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Courbe "ease-out" : le compteur ralentit en arrivant sur la valeur.
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        this.frame = requestAnimationFrame(tick);
      }
    };

    this.frame = requestAnimationFrame(tick);
  }
}
