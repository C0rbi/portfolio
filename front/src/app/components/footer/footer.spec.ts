import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContactDialogService } from '../../shared/contact-dialog.service';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the message window from « Écrire un message »', () => {
    const button = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Écrire un message'),
    );
    expect(button?.getAttribute('aria-haspopup')).toBe('dialog');

    button?.click();
    expect(TestBed.inject(ContactDialogService).ouvert()).toBe(true);
  });
});
