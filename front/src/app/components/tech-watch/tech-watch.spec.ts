import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechWatch } from './tech-watch';

describe('TechWatch', () => {
  let component: TechWatch;
  let fixture: ComponentFixture<TechWatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechWatch],
    }).compileComponents();

    fixture = TestBed.createComponent(TechWatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
