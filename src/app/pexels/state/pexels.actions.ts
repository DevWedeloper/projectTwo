import { HttpErrorResponse } from '@angular/common/http';
import { createActionGroup, props } from '@ngrx/store';
import { PexelsPhoto } from '../types/pexels.type';

export const pexelsActions = createActionGroup({
  source: 'Pexels',
  events: {
    'Change Search Query': props<{ query: string }>(),
    'Load Search Photos': props<{ query: string; perPage: number }>(),
    'Load Search Photos Success': props<{ photos: PexelsPhoto[] | null, theEnd: boolean }>(),
    'Load Search Photos Failure': props<{ error: HttpErrorResponse }>(),
  },
});
