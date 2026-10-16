import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

type Tone = 'accent' | 'lagoon' | 'gold';

interface Skill {
  readonly name: string;
  /** Technologie centrale de ma stack, mise en avant visuellement. */
  readonly core?: boolean;
}

interface SkillGroup {
  readonly title: string;
  readonly caption: string;
  readonly tone: Tone;
  readonly icon: 'window' | 'server' | 'database';
  readonly items: readonly Skill[];
}

@Component({
  selector: 'app-skills',
  imports: [RevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly groups: readonly SkillGroup[] = [
    {
      title: 'Front-end',
      caption: 'Ce que l’utilisateur voit et manipule',
      tone: 'accent',
      icon: 'window',
      items: [
        { name: 'Angular', core: true },
        { name: 'TypeScript', core: true },
        { name: 'SCSS / Sass', core: true },
        { name: 'HTML5 & CSS3' },
        { name: 'JavaScript' },
      ],
    },
    {
      title: 'Back-end',
      caption: 'La logique métier et les API',
      tone: 'lagoon',
      icon: 'server',
      items: [
        { name: 'Java', core: true },
        { name: 'Spring Boot', core: true },
        { name: 'Python', core: true },
        { name: 'API REST' },
        { name: 'PHP' },
        { name: 'Node.js' },
      ],
    },
    {
      title: 'Données & outils',
      caption: 'Stockage, versionnage, environnement',
      tone: 'gold',
      icon: 'database',
      items: [
        { name: 'PostgreSQL', core: true },
        { name: 'MySQL' },
        { name: 'Git & GitHub', core: true },
        { name: 'Docker', core: true },
        { name: 'GitLab CI/CD' },
        { name: 'Linux' },
        { name: 'IntelliJ IDEA / VS Code' },
      ],
    },
  ];

  /** Savoir-faire transverses travaillés en BTS et en entreprise. */
  protected readonly methods: readonly string[] = [
    'Programmation orientée objet',
    'Architecture MVC',
    'Modélisation Merise / UML',
    'Conception d’API REST',
    'Gestion de versions Git',
    'Bonnes pratiques de sécurité',
    'Documentation technique',
  ];
}
