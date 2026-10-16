import { TestBed } from '@angular/core/testing';

import { LegalPage } from './legal';
import { EMAIL } from '../../data/site';

describe('LegalPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalPage],
    }).compileComponents();
  });

  it('should show the publisher and the contact address', async () => {
    const fixture = TestBed.createComponent(LegalPage);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('h1')?.textContent).toContain('Mentions légales');
    expect(host.querySelector(`a[href="mailto:${EMAIL}"]`)).toBeTruthy();
  });
});
