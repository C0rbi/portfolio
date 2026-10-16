import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReefBand } from './reef-band';

describe('ReefBand', () => {
  let component: ReefBand;
  let fixture: ComponentFixture<ReefBand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReefBand],
    }).compileComponents();

    fixture = TestBed.createComponent(ReefBand);
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
