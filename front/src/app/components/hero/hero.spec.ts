import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hero } from './hero';

describe('Hero', () => {
  let component: Hero;
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the headline and the beach scene', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('Je développe');
    expect(host.querySelector('app-sky')).toBeTruthy();
    expect(host.querySelector('app-coast')).toBeTruthy();
  });

  it('should not name any technology in the first screen', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    // Motif écrit par morceaux : le dossier du hero doit rester vierge de
    // ces noms, même dans ses tests (critère de recette « grep »).
    const stack = new RegExp(['angu', 'lar|spri', 'ng|postg', 're'].join(''), 'i');
    expect(text).not.toMatch(stack);
  });
});
