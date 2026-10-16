import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavDrawer } from './nav-drawer';

describe('NavDrawer', () => {
  let component: NavDrawer;
  let fixture: ComponentFixture<NavDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavDrawer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavDrawer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('links', [
      { id: 'about', label: 'Profil', sonde: '+2 m' },
      { id: 'projects', label: 'Projets', sonde: '−2 m' },
    ]);
    fixture.componentRef.setInput('email', 'contact@example.com');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay inert while closed', () => {
    const drawer = (fixture.nativeElement as HTMLElement).querySelector('#mobile-drawer');
    expect(drawer).not.toBeNull();
    expect(drawer?.hasAttribute('inert')).toBe(true);
  });
});
