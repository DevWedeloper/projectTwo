import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PexelsSearchPhotosData } from '../types/pexels.type';

@Injectable({
  providedIn: 'root',
})
export class PexelsApiService {
  private http = inject(HttpClient);
  private url = environment.searchPhotosUrl;

  searchPhotos(
    query: string,
    perPage: number,
  ): Observable<PexelsSearchPhotosData> {
    return this.http.get<PexelsSearchPhotosData>(
      `${this.url}?query=${query}&per_page${perPage}`,
    );
  }
}
