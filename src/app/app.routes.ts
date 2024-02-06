import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./infinite-scroll/infinite-scroll.component').then(
        (m) => m.InfiniteScrollComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
