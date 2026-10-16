import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LagoonFloor } from './lagoon-floor';

describe('LagoonFloor', () => {
  let component: LagoonFloor;
  let fixture: ComponentFixture<LagoonFloor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LagoonFloor],
    }).compileComponents();

    fixture = TestBed.createComponent(LagoonFloor);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('email', 'allan@example.com');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the bottle reachable: decor host, but a real button outside aria-hidden', () => {
    const host = fixture.nativeElement as HTMLElement;
    const bottle = host.querySelector<HTMLButtonElement>('button.bottle');

    expect(host.classList.contains('decor')).toBe(true);
    expect(host.hasAttribute('aria-hidden')).toBe(false);
    expect(bottle?.getAttribute('popovertarget')).toBe('bottle-note');
    // Le nom accessible contient le libellé visible (« Lire le message »)
    expect(bottle?.getAttribute('aria-label')).toBe('Lire le message de la bouteille à la mer');
    expect(host.querySelector('#bottle-note a')?.getAttribute('href')).toBe('mailto:allan@example.com');
  });
});
