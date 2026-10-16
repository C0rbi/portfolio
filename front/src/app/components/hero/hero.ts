import { Component } from '@angular/core';
import { CounterDirective } from '../../shared/counter.directive';
import { Sky } from '../../decor/sky/sky';
import { Coast } from '../../decor/coast/coast';

interface Stat {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

/**
 * Premier écran : on est sur la plage, face à l'îlot Amédée.
 * Le ciel (nuages, sternes) passe sous le texte ; la côte, dans le flux,
 * termine le bloc sur le sable où sont posés les chiffres clés.
 */
@Component({
  selector: 'app-hero',
  imports: [CounterDirective, Sky, Coast],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly stats: readonly Stat[] = [
    { value: 3, suffix: '', label: 'expériences en entreprise' },
    { value: 4, suffix: '', label: 'projets publiés' },
    { value: 9, suffix: '', label: 'certifications suivies' },
  ];
}
