import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaLight } from './sea-light';

describe('SeaLight', () => {
  let component: SeaLight;
  let fixture: ComponentFixture<SeaLight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeaLight],
    }).compileComponents();

    fixture = TestBed.createComponent(SeaLight);
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
