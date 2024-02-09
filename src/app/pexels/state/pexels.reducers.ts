import { HttpErrorResponse } from '@angular/common/http';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PexelsPhoto } from '../types/pexels.type';
import { pexelsActions } from './pexels.actions';

type PexelsState = {
  photos: PexelsPhoto[] | null;
  loadSearchPhotosState: 'pending' | 'loading' | 'error' | 'success';
  hasLoadSearchPhotosError: HttpErrorResponse | null;
  searchQuery: string;
  perPage: number;
  page: number;
};

const initialState: PexelsState = {
  photos: null,
  loadSearchPhotosState: 'pending',
  hasLoadSearchPhotosError: null,
  searchQuery: '',
  perPage: 15,
  page: 1,
};

const pexelsFeature = createFeature({
  name: 'Pexels',
  reducer: createReducer(
    initialState,
    on(pexelsActions.loadSearchPhotos, (state, action) => ({
      ...state,
      loadSearchPhotosState: 'loading' as const,
      searchQuery: action.query,
      perPage: action.perPage,
    })),
    on(pexelsActions.loadSearchPhotosSuccess, (state, action) => ({
      ...state,
      photos: action.photos,
      loadSearchPhotosState: 'success' as const,
      hasLoadSearchPhotosError: null,
      page: state.page + 1,
    })),
    on(pexelsActions.loadSearchPhotosFailure, (state, action) => ({
      ...state,
      photos: null,
      loadSearchPhotosState: 'error' as const,
      hasLoadSearchPhotosError: action.error,
    })),
    on(pexelsActions.changeSearchQuery, (state, action) => ({
      ...state,
      searchQuery: action.query,
      page: 1,
    })),
  ),
  extraSelectors: ({ selectLoadSearchPhotosState }) => ({
    selectIsLoadingSearchPhotos: createSelector(
      selectLoadSearchPhotosState,
      (loadSearchPhotosState) => loadSearchPhotosState === 'loading',
    ),
    selectLoadSearchPhotosSuccess: createSelector(
      selectLoadSearchPhotosState,
      (loadSearchPhotosState) => loadSearchPhotosState === 'success',
    ),
  }),
});

export const {
  name: pexelsFeatureKey,
  reducer: pexelsReducer,
  selectPhotos,
  selectSearchQuery,
  selectPerPage,
  selectPage,
  selectIsLoadingSearchPhotos,
  selectLoadSearchPhotosSuccess,
  selectHasLoadSearchPhotosError,
} = pexelsFeature;
