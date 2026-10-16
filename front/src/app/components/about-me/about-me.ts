import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Fact {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-about-me',
  imports: [RevealDirective],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
})
export class AboutMe {
  protected readonly facts: readonly Fact[] = [
    { label: 'Localisation', value: 'Nouméa, Nouvelle-Calédonie' },
    { label: 'Formation', value: 'BTS SIO · option SLAM' },
    { label: 'Entreprise', value: 'CSB · alternance' },
    { label: 'Recherche', value: 'Stage 2027 · Licence MIAW' },
  ];
}
