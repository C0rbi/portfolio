import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishSchool } from './fish-school';

describe('FishSchool', () => {
  let component: FishSchool;
  let fixture: ComponentFixture<FishSchool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FishSchool],
    }).compileComponents();

    fixture = TestBed.createComponent(FishSchool);
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
