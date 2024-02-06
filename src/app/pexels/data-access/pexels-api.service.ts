import { HttpClient, HttpResponse } from '@angular/common/http';
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
  ): Observable<HttpResponse<PexelsSearchPhotosData[]>> {
    return this.http.get<PexelsSearchPhotosData[]>(
      `${this.url}?query=${query}&per_page${perPage}`,
      { observe: 'response' },
    );
  }
}
