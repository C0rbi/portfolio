import { Component, computed, effect, inject, input } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { PROJECTS, findProject } from '../../data/projects';
import { competenceLabel } from '../../data/competences';
import { RevealDirective } from '../../shared/reveal.directive';
import { CodeBlock } from '../../shared/code-block/code-block';
import { MiniHorizon } from '../../decor/mini-horizon/mini-horizon';
import { Shoreline } from '../../decor/shoreline/shoreline';

@Component({
  selector: 'app-project',
  imports: [RouterLink, RevealDirective, CodeBlock, MiniHorizon, Shoreline],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class ProjectPage {
  /** Paramètre `:slug` de l'URL, lié à cet input par le routeur (withComponentInputBinding, voir app.config.ts). */
  readonly slug = input<string>();

  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly project = computed(() => findProject(this.slug() ?? null));

  /** Libellé d'une compétence du bloc 1, pour l'encadré « En bref ». */
  protected readonly label = competenceLabel;

  /**
   * Projet suivant dans la liste, pour enchaîner la lecture. La liste boucle
   * (modulo) : il existe toujours, et la page finit donc toujours dans l'eau.
   */
  protected readonly next = computed(() => {
    const current = this.project();
    if (!current) {
      return undefined;
    }
    const index = PROJECTS.findIndex((p) => p.slug === current.slug);
    return PROJECTS[(index + 1) % PROJECTS.length];
  });

  constructor() {
    effect(() => {
      const project = this.project();

      // Slug inconnu : on renvoie sur la liste des projets plutôt que
      // d'afficher une page vide.
      if (this.slug() && !project) {
        void this.router.navigate(['/'], { fragment: 'projects' });
        return;
      }

      if (project) {
        this.title.setTitle(`${project.name} — Projet d'Allan Nicolas`);
        this.meta.updateTag({ name: 'description', content: project.summary });
      }
    });
  }
}
