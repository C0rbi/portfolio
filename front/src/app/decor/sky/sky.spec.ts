import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sky } from './sky';

describe('Sky', () => {
  let component: Sky;
  let fixture: ComponentFixture<Sky>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sky],
    }).compileComponents();

    fixture = TestBed.createComponent(Sky);
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
});
