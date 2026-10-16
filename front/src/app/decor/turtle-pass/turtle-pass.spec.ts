import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurtlePass } from './turtle-pass';

describe('TurtlePass', () => {
  let component: TurtlePass;
  let fixture: ComponentFixture<TurtlePass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurtlePass],
    }).compileComponents();

    fixture = TestBed.createComponent(TurtlePass);
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
