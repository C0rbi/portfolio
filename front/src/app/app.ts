import { Component, signal } from '@angular/core';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Hero } from "./components/hero/hero";
import { Projects } from "./components/projects/projects";
import { Skills } from "./components/skills/skills";
import { Experience } from "./components/experience/experience";
import { TechWatch } from "./components/tech-watch/tech-watch";


@Component({
  selector: 'app-root',
  imports: [Header, Footer, Hero, Projects, Skills, Experience, TechWatch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
