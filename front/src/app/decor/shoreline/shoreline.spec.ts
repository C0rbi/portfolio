import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shoreline } from './shoreline';

describe('Shoreline', () => {
  let component: Shoreline;
  let fixture: ComponentFixture<Shoreline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shoreline],
    }).compileComponents();

    fixture = TestBed.createComponent(Shoreline);
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
