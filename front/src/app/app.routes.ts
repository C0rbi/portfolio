import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Allan Nicolas — Développeur Full Stack | Portfolio BTS SIO SLAM',
  },
  {
    path: 'projets/:slug',
    loadComponent: () => import('./pages/project/project').then((m) => m.ProjectPage),
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal/legal').then((m) => m.LegalPage),
    title: 'Mentions légales — Allan Nicolas',
  },
  {
    // Boîte de réception des messages : liée nulle part, protégée par jeton
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminPage),
    title: 'Messages — Administration',
  },
  { path: '**', redirectTo: '' },
];
