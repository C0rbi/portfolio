import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../data/projects';
import { RevealDirective } from '../../shared/reveal.directive';
import { SpotlightDirective } from '../../shared/spotlight.directive';
import { Missions } from '../missions/missions';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, RevealDirective, SpotlightDirective, Missions],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly featured = PROJECTS.find((project) => project.featured);
  protected readonly others = PROJECTS.filter((project) => !project.featured);
}
