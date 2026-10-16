import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the hero headline', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Je développe');
  });

  it('should render every section anchored in the navigation', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const id of ['about', 'experience', 'projects', 'skills', 'certifications', 'tech-watch']) {
      expect(compiled.querySelector(`#${id}`)).toBeTruthy();
    }
  });
});
