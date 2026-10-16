import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandSteps } from './sand-steps';

describe('SandSteps', () => {
  let component: SandSteps;
  let fixture: ComponentFixture<SandSteps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandSteps],
    }).compileComponents();

    fixture = TestBed.createComponent(SandSteps);
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
