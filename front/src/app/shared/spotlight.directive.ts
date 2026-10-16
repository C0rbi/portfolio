import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Suit le curseur au-dessus d'un élément et expose sa position en
 * pourcentage via les variables CSS `--mx` et `--my`.
 *
 * Le SCSS du composant s'en sert pour dessiner un halo qui accompagne
 * la souris. Écoute pointerenter/move/leave sur l'hôte : pointermove ne se
 * déclenche qu'au survol, donc rien ne tourne quand le pointeur est ailleurs.
 */
@Directive({
  selector: '[appSpotlight]',
  host: {
    '(pointerenter)': 'onEnter()',
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class SpotlightDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected onEnter(): void {
    this.host.nativeElement.style.setProperty('--spot', '1');
  }

  protected onMove(event: PointerEvent): void {
    const element = this.host.nativeElement;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    element.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  protected onLeave(): void {
    this.host.nativeElement.style.setProperty('--spot', '0');
  }
}
