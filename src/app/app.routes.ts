import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PexelsEffects } from './pexels/state/pexels.effects';
import {
  pexelsFeatureKey,
  pexelsReducer,
} from './pexels/state/pexels.reducers';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    providers: [
      provideState(pexelsFeatureKey, pexelsReducer),
      provideEffects(PexelsEffects),
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
