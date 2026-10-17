import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminPage } from './admin';

const NON_CONNECTE = { status: 401, statusText: 'Unauthorized' };

describe('AdminPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  function seConnecter(host: HTMLElement, identifiant: string, motDePasse: string): void {
    const champs: [string, string][] = [
      ['#admin-identifiant', identifiant],
      ['#admin-mdp', motDePasse],
    ];
    for (const [selecteur, valeur] of champs) {
      const champ = host.querySelector<HTMLInputElement>(selecteur)!;
      champ.value = valeur;
      champ.dispatchEvent(new Event('input'));
    }
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
  }

  it('should log in with the admin account, then list the messages', async () => {
    const fixture = TestBed.createComponent(AdminPage);
    const http = TestBed.inject(HttpTestingController);
    const host = fixture.nativeElement as HTMLElement;

    // Aucune session ouverte : le formulaire de connexion s'affiche
    http.expectOne('/api/admin/session').flush(null, NON_CONNECTE);
    await fixture.whenStable();

    seConnecter(host, 'allan', 'un-mot-de-passe-solide');
    const connexion = http.expectOne('/api/admin/connexion');
    expect(connexion.request.body).toEqual({ identifiant: 'allan', motDePasse: 'un-mot-de-passe-solide' });
    connexion.flush({ identifiant: 'allan' });

    http.expectOne('/api/messages').flush([
      { id: 1, nom: 'Jeanne', email: 'jeanne@exemple.nc', contenu: 'Bonjour !', creeLe: '2026-10-15T09:00:00Z', lu: false },
    ]);
    await fixture.whenStable();

    expect(host.querySelectorAll('.msg').length).toBe(1);
    expect(host.textContent).toContain('dont 1 non lu');
    expect(host.querySelector('.admin__who')?.textContent).toContain('allan');
    http.verify();
  });

  it('should explain a refused password and keep the form', async () => {
    const fixture = TestBed.createComponent(AdminPage);
    const http = TestBed.inject(HttpTestingController);
    const host = fixture.nativeElement as HTMLElement;

    http.expectOne('/api/admin/session').flush(null, NON_CONNECTE);
    await fixture.whenStable();

    seConnecter(host, 'allan', 'mauvais-mot-de-passe');
    http.expectOne('/api/admin/connexion').flush(null, NON_CONNECTE);
    await fixture.whenStable();

    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Identifiant ou mot de passe incorrect');
    expect(host.querySelector<HTMLInputElement>('#admin-mdp')?.value).toBe('');
    http.verify();
  });

  it('should resume a session that is still open', async () => {
    const fixture = TestBed.createComponent(AdminPage);
    const http = TestBed.inject(HttpTestingController);
    const host = fixture.nativeElement as HTMLElement;

    http.expectOne('/api/admin/session').flush({ identifiant: 'allan' });
    http.expectOne('/api/messages').flush([]);
    await fixture.whenStable();

    expect(host.querySelector('#admin-identifiant')).toBeNull();
    expect(host.textContent).toContain('Aucun message');
    http.verify();
  });
});
