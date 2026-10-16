import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InViewDirective } from './in-view.directive';

@Component({
  imports: [InViewDirective],
  template: `<div appInView></div>`,
})
class HostComponent {}

describe('InViewDirective', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function create(): { fixture: ComponentFixture<HostComponent>; element: HTMLElement } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('div') as HTMLElement;
    return { fixture, element };
  }

  it('treats the host as visible when IntersectionObserver is missing', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const { fixture, element } = create();
    fixture.detectChanges();

    expect(element.classList.contains('is-inview')).toBe(true);
    expect(element.classList.contains('is-seen')).toBe(true);
  });

  it('toggles is-inview and keeps is-seen once the host has been seen', () => {
    let notify: (entries: Partial<IntersectionObserverEntry>[]) => void = () => undefined;
    let options: IntersectionObserverInit | undefined;
    const disconnect = vi.fn();

    class FakeObserver {
      constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void, init?: IntersectionObserverInit) {
        notify = callback;
        options = init;
      }
      observe(): void {}
      disconnect = disconnect;
    }
    vi.stubGlobal('IntersectionObserver', FakeObserver);

    const { fixture, element } = create();
    expect(options?.rootMargin).toBe('20% 0px');
    expect(element.classList.contains('is-inview')).toBe(false);
    expect(element.classList.contains('is-seen')).toBe(false);

    notify([{ isIntersecting: true }]);
    fixture.detectChanges();
    expect(element.classList.contains('is-inview')).toBe(true);
    expect(element.classList.contains('is-seen')).toBe(true);

    notify([{ isIntersecting: false }]);
    fixture.detectChanges();
    expect(element.classList.contains('is-inview')).toBe(false);
    expect(element.classList.contains('is-seen')).toBe(true);

    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
});
