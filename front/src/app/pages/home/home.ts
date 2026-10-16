import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { AboutMe } from '../../components/about-me/about-me';
import { Experience } from '../../components/experience/experience';
import { Projects } from '../../components/projects/projects';
import { Skills } from '../../components/skills/skills';
import { Certifications } from '../../components/certifications/certifications';
import { TechWatch } from '../../components/tech-watch/tech-watch';
import { SandSteps } from '../../decor/sand-steps/sand-steps';
import { Shoreline } from '../../decor/shoreline/shoreline';
import { SeaLight } from '../../decor/sea-light/sea-light';
import { FishSchool } from '../../decor/fish-school/fish-school';
import { TurtlePass } from '../../decor/turtle-pass/turtle-pass';
import { ReefBand } from '../../decor/reef-band/reef-band';

/**
 * Page d'accueil : une coupe verticale du lagon, du ciel jusqu'au fond.
 * Chaque bloc porte sa profondeur (`data-depth`, en mètres) que le
 * profondimètre du header interpole au fil du défilement.
 */
@Component({
  selector: 'app-home',
  imports: [
    Hero,
    AboutMe,
    Experience,
    Projects,
    Skills,
    Certifications,
    TechWatch,
    SandSteps,
    Shoreline,
    SeaLight,
    FishSchool,
    TurtlePass,
    ReefBand,
  ],
  templateUrl: './home.html',
})
export class Home {}
