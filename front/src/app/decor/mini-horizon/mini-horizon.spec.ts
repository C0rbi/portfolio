import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniHorizon } from './mini-horizon';

describe('MiniHorizon', () => {
  let component: MiniHorizon;
  let fixture: ComponentFixture<MiniHorizon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniHorizon],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniHorizon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay a decorative layer hidden from assistive technologies', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('decor')).toBe(true);
    expect(host.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not reference any #id (the page uses <base href="/">)', () => {
    const markup = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(markup).not.toMatch(/url\(#|href="#/);
  });
});
