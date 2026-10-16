import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContactDialogService } from '../../shared/contact-dialog.service';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the mobile drawer from the burger', async () => {
    const host = fixture.nativeElement as HTMLElement;
    const burger = host.querySelector<HTMLButtonElement>('.burger');
    const drawer = host.querySelector('#mobile-drawer');

    expect(drawer?.hasAttribute('inert')).toBe(true);

    burger?.click();
    await fixture.whenStable();

    expect(burger?.getAttribute('aria-expanded')).toBe('true');
    expect(drawer?.hasAttribute('inert')).toBe(false);
  });

  it('should open the message window from « Me contacter »', () => {
    const cta = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.nav__cta');
    expect(cta?.getAttribute('aria-haspopup')).toBe('dialog');

    cta?.click();
    expect(TestBed.inject(ContactDialogService).ouvert()).toBe(true);
  });

  it('should close the drawer before opening the message window', async () => {
    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLButtonElement>('.burger')?.click();
    await fixture.whenStable();

    host.querySelector<HTMLButtonElement>('.drawer__foot .btn')?.click();
    await fixture.whenStable();

    expect(TestBed.inject(ContactDialogService).ouvert()).toBe(true);
    expect(host.querySelector('#mobile-drawer')?.hasAttribute('inert')).toBe(true);
  });

  it('should expose the « Calme plat » state with aria-pressed', async () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.nav__calm');
    expect(button).not.toBeNull();

    const before = button?.getAttribute('aria-pressed');
    button?.click();
    await fixture.whenStable();
    expect(button?.getAttribute('aria-pressed')).not.toBe(before);

    // On remet l'état d'origine (il est mémorisé d'un test à l'autre).
    button?.click();
    await fixture.whenStable();
  });
});
