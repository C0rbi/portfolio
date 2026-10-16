import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coast } from './coast';

describe('Coast', () => {
  let component: Coast;
  let fixture: ComponentFixture<Coast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coast],
    }).compileComponents();

    fixture = TestBed.createComponent(Coast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the lighthouse button to assistive technologies', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-hidden')).toBeNull();
    expect(host.querySelector('button[aria-label="Allumer le phare Amédée"]')).toBeTruthy();
  });

  it('should announce the lighthouse once, ignoring a second click', async () => {
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector<HTMLButtonElement>('.coast__phare')!;
    const status = host.querySelector('[role="status"]')!;

    expect(status.textContent?.trim()).toBe('');

    button.click();
    button.click();
    await fixture.whenStable();

    expect(status.textContent).toContain('Phare Amédée · allumé depuis 1865');
    expect(host.querySelectorAll('.is-lit').length).toBe(1);
  });
});
