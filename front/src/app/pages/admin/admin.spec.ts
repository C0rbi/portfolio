import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminPage } from './admin';

describe('AdminPage', () => {
  beforeEach(async () => {
    try {
      sessionStorage.clear();
    } catch {
      // Stockage indisponible : rien à nettoyer
    }
    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should ask for the token, then list the messages with it', async () => {
    const fixture = TestBed.createComponent(AdminPage);
    const http = TestBed.inject(HttpTestingController);
    const host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();

    const champ = host.querySelector<HTMLInputElement>('#admin-jeton')!;
    champ.value = 'mon-jeton';
    champ.dispatchEvent(new Event('input'));
    host.querySelector('form')!.dispatchEvent(new Event('submit'));

    const requete = http.expectOne('/api/messages');
    expect(requete.request.headers.get('Authorization')).toBe('Bearer mon-jeton');
    requete.flush([
      { id: 1, nom: 'Jeanne', email: 'jeanne@exemple.nc', contenu: 'Bonjour !', creeLe: '2026-10-15T09:00:00Z', lu: false },
    ]);
    await fixture.whenStable();

    expect(host.querySelectorAll('.msg').length).toBe(1);
    expect(host.textContent).toContain('dont 1 non lu');
    http.verify();
  });
});
