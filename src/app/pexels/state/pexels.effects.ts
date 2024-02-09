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
  selectNextPage,
  selectPerPage,
  selectPhotos,
  selectSearchQuery,
} from './pexels.reducers';
import { PexelsPhoto } from '../types/pexels.type';

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
        this.store.select(selectNextPage),
        this.store.select(selectPhotos),
      ),
      switchMap(([, query, perPage, page, previousPhotos]) =>
        this.pexelsApiService.searchPhotos(query, perPage, page).pipe(
          map((data) => data.photos),
          map((photos) =>
            calculatePhotosAndTheEnd(previousPhotos || [], photos, perPage),
          ),
        ),
      ),
      map((data) => pexelsActions.loadSearchPhotosSuccess(data)),
      catchError((error) => of(pexelsActions.loadSearchPhotosFailure(error))),
    ),
  );

  changeSearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pexelsActions.changeSearchQuery),
      withLatestFrom(
        this.store.select(selectSearchQuery),
        this.store.select(selectPerPage),
        this.store.select(selectNextPage),
      ),
      switchMap(([, query, perPage, page]) =>
        this.pexelsApiService.searchPhotos(query, perPage, page).pipe(
          map((data) => data.photos),
          map((photos) =>
            calculatePhotosAndTheEnd([], photos, perPage),
          ),
        ),
      ),
      map((data) => pexelsActions.loadSearchPhotosSuccess(data)),
      catchError((error) => of(pexelsActions.loadSearchPhotosFailure(error))),
    ),
  );
}

function calculatePhotosAndTheEnd(
  previousPhotos: PexelsPhoto[],
  photos: PexelsPhoto[],
  perPage: number,
): { photos: PexelsPhoto[]; theEnd: boolean } {
  const totalPhotos = [...(previousPhotos || []), ...photos];
  const theEnd = totalPhotos.length === 0 || totalPhotos.length < perPage;
  return { photos: totalPhotos, theEnd };
}
