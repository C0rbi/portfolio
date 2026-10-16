import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let http: HttpTestingController;
  let host: HTMLElement;

  /** Remplit un champ comme le ferait un visiteur. */
  function remplir(selecteur: string, valeur: string): void {
    const champ = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(selecteur)!;
    champ.value = valeur;
    champ.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    http = TestBed.inject(HttpTestingController);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should not send an incomplete form and explain why', async () => {
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    http.expectNone('/api/messages');
    expect(host.textContent).toContain('Indiquez votre nom.');
  });

  it('should send the message to the API and thank the visitor', async () => {
    remplir('#cform-nom', 'Jeanne');
    remplir('#cform-email', 'jeanne@exemple.nc');
    remplir('#cform-contenu', 'Bonjour, une question sur votre projet LDNC.');
    host.querySelector('form')!.dispatchEvent(new Event('submit'));

    const requete = http.expectOne('/api/messages');
    expect(requete.request.method).toBe('POST');
    expect(requete.request.body.email).toBe('jeanne@exemple.nc');
    requete.flush(null, { status: 201, statusText: 'Created' });
    await fixture.whenStable();

    expect(host.querySelector('.cform__status')?.textContent).toContain('bien arrivé');
  });

  it('should explain the rate limit when the API answers 429', async () => {
    remplir('#cform-nom', 'Jeanne');
    remplir('#cform-email', 'jeanne@exemple.nc');
    remplir('#cform-contenu', 'Bonjour, une question sur votre projet LDNC.');
    host.querySelector('form')!.dispatchEvent(new Event('submit'));

    http.expectOne('/api/messages').flush(null, { status: 429, statusText: 'Too Many Requests' });
    await fixture.whenStable();

    expect(host.querySelector('.cform__status')?.textContent).toContain('Trop de messages');
  });
});
