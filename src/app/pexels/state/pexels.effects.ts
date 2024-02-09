import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  map,
  of,
  switchMap,
  throttleTime,
  withLatestFrom,
} from 'rxjs';
import { PexelsApiService } from '../data-access/pexels-api.service';
import { pexelsActions } from './pexels.actions';
import {
  selectPage,
  selectPerPage,
  selectPhotos,
  selectSearchQuery,
} from './pexels.reducers';

@Injectable()
export class PexelsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private pexelsApiService = inject(PexelsApiService);

  loadSearchPhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pexelsActions.loadSearchPhotos),
      throttleTime(500),
      withLatestFrom(
        this.store.select(selectSearchQuery),
        this.store.select(selectPerPage),
        this.store.select(selectPage),
        this.store.select(selectPhotos),
      ),
      switchMap(([, query, perPage, page, previousPhotos]) =>
        this.pexelsApiService.searchPhotos(query, perPage, page).pipe(
          map((data) => data.photos),
          map((photos) => [...(previousPhotos || []), ...photos]),
        ),
      ),
      map((photos) => pexelsActions.loadSearchPhotosSuccess({ photos })),
      catchError((error) => of(pexelsActions.loadSearchPhotosFailure(error))),
    ),
  );

  changeSearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pexelsActions.changeSearchQuery),
      withLatestFrom(
        this.store.select(selectSearchQuery),
        this.store.select(selectPerPage),
        this.store.select(selectPage),
      ),
      switchMap(([, query, perPage, page]) =>
        this.pexelsApiService.searchPhotos(query, perPage, page).pipe(
          map((data) => data.photos),
          map((photos) => [...[], ...photos]),
        ),
      ),
      map((photos) => pexelsActions.loadSearchPhotosSuccess({ photos })),
      catchError((error) => of(pexelsActions.loadSearchPhotosFailure(error))),
    ),
  );
}
