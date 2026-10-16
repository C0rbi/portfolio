import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ContactDialogService } from '../../shared/contact-dialog.service';
import { MotionService } from '../../shared/motion.service';
import { NavDrawer } from './nav-drawer/nav-drawer';

/** Lien de la navigation principale, partagé avec le tiroir mobile. */
export interface NavLink {
  readonly id: string;
  readonly label: string;
  /** Sonde de la section, comme sur une carte marine (« −2 m »). */
  readonly sonde: string;
}

/** Zone traversée par la lecture : elle teinte la barre et le navigateur. */
type Zone = 'sky' | 'sand' | 'sea';

/** Couleur de la barre du navigateur mobile (`theme-color`) par zone. */
const THEME_COLOR: Record<Zone, string> = {
  sky: '#a9dbf3',
  sand: '#f6ead0',
  sea: '#cbeded',
};

/** Ce que le tiroir mobile recouvre : rendu inerte tant qu'il est ouvert. */
function behindDrawer(): Element[] {
  return Array.from(document.querySelectorAll('main, app-footer, .skip-link'));
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavDrawer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly links: readonly NavLink[] = [
    { id: 'about', label: 'Profil', sonde: '+2 m' },
    { id: 'experience', label: 'Parcours', sonde: '+1 m' },
    { id: 'projects', label: 'Projets', sonde: '−2 m' },
    { id: 'skills', label: 'Compétences', sonde: '−6 m' },
    { id: 'tech-watch', label: 'Veille', sonde: '−16 m' },
  ];

  protected readonly email = 'allan.nicolas331966@gmail.com';

  /** Vrai dès que la page a défilé : la barre passe en mode compact. */
  protected readonly scrolled = signal(false);
  /** Avancement de la lecture, de 0 à 1, pour le filet de progression. */
  protected readonly progress = signal(0);
  /** Section actuellement sous les yeux du visiteur. */
  protected readonly active = signal('');
  /** État du panneau de navigation mobile. */
  protected readonly menuOpen = signal(false);

  // ============================================================
  //  Profondimètre : la lecture est une plongée, de +4 m à −22 m.
  //  Les repères sont les éléments `[data-depth]` de la page.
  // ============================================================
  protected readonly depth = signal(4);
  protected readonly depthLabel = computed(() => {
    const d = this.depth();
    return d > 0 ? `+${d} m` : d < 0 ? `−${-d} m` : '0 m';
  });
  protected readonly zone = computed<Zone>(() =>
    this.depth() >= 3 ? 'sky' : this.depth() >= 0 ? 'sand' : 'sea',
  );
  protected readonly zoneLabel = computed(
    () => ({ sky: 'ciel', sand: 'plage', sea: this.depth() <= -20 ? 'fond' : 'lagon' })[this.zone()],
  );

  /** « Calme plat » : met en pause toutes les animations décoratives. */
  protected readonly motion = inject(MotionService);
  /** « Me contacter » ouvre la fenêtre « Écrire un message ». */
  protected readonly contact = inject(ContactDialogService);

  private readonly navList = viewChild<ElementRef<HTMLElement>>('navList');
  private readonly navLinks = viewChildren<ElementRef<HTMLAnchorElement>>('navLink');
  private readonly burger = viewChild<ElementRef<HTMLButtonElement>>('burger');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  /** Change à chaque redimensionnement : la pastille se recale. */
  private readonly viewport = signal(0);
  /** Une lecture de mise en page est déjà prévue pour la prochaine frame. */
  private ticking = false;

  constructor() {
    // Déplace le repère glissant sous le lien actif.
    effect(() => {
      this.viewport();
      const current = this.active();
      const list = this.navList()?.nativeElement;
      if (!list) {
        return;
      }

      const target = this.navLinks().find((ref) => ref.nativeElement.dataset['id'] === current);
      if (!target) {
        list.style.setProperty('--pill-opacity', '0');
        return;
      }

      const { offsetLeft, offsetWidth } = target.nativeElement;
      list.style.setProperty('--pill-x', `${offsetLeft}px`);
      list.style.setProperty('--pill-w', `${offsetWidth}px`);
      list.style.setProperty('--pill-opacity', '1');
    });

    // Menu ouvert : la page ne défile plus et tout ce qui est derrière le
    // tiroir devient inerte, le focus reste dans la barre et le tiroir.
    effect(() => {
      const open = this.menuOpen();
      if (typeof document === 'undefined') {
        return;
      }
      document.body.style.overflow = open ? 'hidden' : '';
      for (const el of behindDrawer()) {
        el.toggleAttribute('inert', open);
      }
    });

    // La barre du navigateur mobile prend la couleur de la zone traversée.
    effect(() => {
      const color = THEME_COLOR[this.zone()];
      if (typeof document !== 'undefined') {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
      }
    });

    // Nouvelle page (accueil chargé à la demande, fiche projet) : les
    // repères de profondeur ont changé, on relit une fois la page rendue.
    const navigation = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        afterNextRender(() => this.scheduleRead(), { injector: this.injector });
      }
    });
    this.destroyRef.onDestroy(() => navigation.unsubscribe());

    afterNextRender(() => {
      const onScroll = () => this.scheduleRead();
      const onResize = () => {
        this.viewport.update((n) => n + 1);
        this.scheduleRead();
      };
      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.menuOpen()) {
          this.closeMenu();
          // Le tiroir devient inerte : le focus revient sur le bouton qui l'a ouvert.
          this.burger()?.nativeElement.focus();
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('keydown', onKeydown);
      this.readScroll();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKeydown);
        document.body.style.overflow = '';
        for (const el of behindDrawer()) {
          el.removeAttribute('inert');
        }
      });
    });
  }

  /**
   * Lien d'évitement : on reste sur la page courante (le `href="#main"` seul
   * ramènerait à l'accueil, à cause de `<base href="/">`) et le focus part
   * dans le contenu, pour que la tabulation suivante y continue.
   */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main');
    if (!main) {
      return;
    }
    main.setAttribute('tabindex', '-1');
    main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
    main.focus({ preventScroll: true });
    // Sans `behavior` : suit le scroll-behavior CSS, donc instantané sous reduce.
    main.scrollIntoView();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /**
   * « Me contacter » du tiroir : le tiroir se ferme, puis la fenêtre
   * s'ouvre. Le focus passe d'abord par le bouton du menu : c'est à lui
   * que la fenêtre le rendra en se fermant (le tiroir sera inerte).
   */
  protected ecrireDepuisMenu(): void {
    this.closeMenu();
    this.burger()?.nativeElement.focus();
    this.contact.ouvrir();
  }

  /**
   * Garde rAF : quel que soit le nombre d'évènements reçus, la page n'est
   * mesurée qu'une fois par frame.
   */
  private scheduleRead(): void {
    if (typeof requestAnimationFrame !== 'function') {
      this.readScroll();
      return;
    }
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      this.readScroll();
    });
  }

  /** Met à jour la progression, la section active et la profondeur. */
  private readScroll(): void {
    const doc = document.documentElement;
    const scrolled = window.scrollY;
    const scrollable = doc.scrollHeight - doc.clientHeight;

    this.scrolled.set(scrolled > 24);
    this.progress.set(scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0);

    // La section active est la dernière dont le haut a dépassé le tiers
    // supérieur de l'écran : c'est celle que l'on est en train de lire.
    const marker = scrolled + window.innerHeight * 0.34;
    let current = '';

    for (const link of this.links) {
      const section = document.getElementById(link.id);
      if (section && section.getBoundingClientRect().top + scrolled <= marker) {
        current = link.id;
      }
    }

    this.active.set(current);

    // Tout en bas de la page, on touche le fond, même si le dernier repère
    // n'atteint pas le tiers de l'écran.
    const bottom = scrollable > 0 && scrollable - scrolled < 2;
    this.readDepth(bottom ? Number.POSITIVE_INFINITY : marker, scrolled);
  }

  /**
   * Profondeur au niveau du repère de lecture : interpolée entre les deux
   * éléments `[data-depth]` qui l'encadrent.
   */
  private readDepth(marker: number, scrolled: number): void {
    let prev: { y: number; d: number } | null = null;

    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'))) {
      const y = el.getBoundingClientRect().top + scrolled;
      const d = Number(el.dataset['depth']);
      if (y > marker) {
        this.depth.set(prev ? Math.round(prev.d + ((d - prev.d) * (marker - prev.y)) / (y - prev.y)) : d);
        return;
      }
      prev = { y, d };
    }

    if (prev) {
      this.depth.set(prev.d);
    }
  }
}
