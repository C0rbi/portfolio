import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContactDialogService } from '../../shared/contact-dialog.service';
import { ContactDialog } from './contact-dialog';

describe('ContactDialog', () => {
  let fixture: ComponentFixture<ContactDialog>;
  let contact: ContactDialogService;
  let dialog: HTMLDialogElement;

  beforeAll(() => {
    // jsdom connaît <dialog> et son attribut open, mais pas encore
    // showModal() ni close() : on les simule.
    const proto = HTMLDialogElement.prototype;
    proto.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };
    proto.close ??= function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDialog],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDialog);
    contact = TestBed.inject(ContactDialogService);
    await fixture.whenStable();
    dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog') as HTMLDialogElement;
  });

  it('should open with the form, then close with the cross', async () => {
    expect(dialog.open).toBe(false);

    contact.ouvrir();
    await fixture.whenStable();
    expect(dialog.open).toBe(true);
    expect(dialog.querySelector('#cform-nom')).not.toBeNull();

    dialog.querySelector<HTMLButtonElement>('.cdialog__close')?.click();
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(contact.ouvert()).toBe(false);
  });

  it('should follow a close made by the browser (Escape key)', async () => {
    contact.ouvrir();
    await fixture.whenStable();

    dialog.close();
    await fixture.whenStable();
    expect(contact.ouvert()).toBe(false);
  });

  it('should close on the backdrop, not on a click inside the card', async () => {
    contact.ouvrir();
    await fixture.whenStable();

    const form = dialog.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    form.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(dialog.open).toBe(true);

    // Sur le voile, la cible des évènements est le <dialog> lui-même
    dialog.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
  });
});
