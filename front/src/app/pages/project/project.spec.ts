import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectPage } from './project';
import { PROJECTS } from '../../data/projects';

describe('ProjectPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the project matching the slug', async () => {
    const fixture = TestBed.createComponent(ProjectPage);
    fixture.componentRef.setInput('slug', 'ldnc');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('LDNC');
    expect(compiled.querySelectorAll('app-code-block').length).toBeGreaterThan(0);
  });

  it('should expose a code sample for every project', () => {
    for (const project of PROJECTS) {
      expect(project.samples.length).toBeGreaterThan(0);
    }
  });

  it('should read as a descent: sky, sand, shoreline, then the lagoon', async () => {
    const fixture = TestBed.createComponent(ProjectPage);
    fixture.componentRef.setInput('slug', 'ldnc');
    await fixture.whenStable();

    const article = (fixture.nativeElement as HTMLElement).querySelector('article.project');
    expect(article?.querySelector('.phead app-mini-horizon')).toBeTruthy();
    expect(article?.querySelector('.zone--sand .pbody__side')).toBeTruthy();
    expect(article?.querySelector('app-shoreline')).toBeTruthy();

    // La page finit dans l'eau, juste avant le footer
    expect(article?.lastElementChild?.classList.contains('zone--sea')).toBe(true);
    expect(article?.querySelector('.zone--sea .pnext')).toBeTruthy();

    // Profondeurs lues par le profondimètre du header
    const depths = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('article [data-depth]'),
      (el) => el.dataset['depth'],
    );
    expect(depths).toEqual(['3', '1', '0', '-3']);
  });
});
