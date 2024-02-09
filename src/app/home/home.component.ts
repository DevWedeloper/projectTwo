import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { pexelsActions } from '../pexels/state/pexels.actions';
import {
  selectIsLoadingSearchPhotos,
  selectPhotos,
} from '../pexels/state/pexels.reducers';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private store = inject(Store);
  protected photos$ = this.store.select(selectPhotos);
  protected loading$ = this.store.select(selectIsLoadingSearchPhotos);
  protected value = 'dog';
  private batchSize = 15;
  protected theEnd = false;
  protected searchQuery$ = new Subject<string>();
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor() {
    this.searchQuery$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((query) => {
        this.store.dispatch(
          pexelsActions.changeSearchQuery({
            query,
          }),
        );
      });
  }

  getNextBatch() {
    // if (this.theEnd) {
    //   return;
    // }

    const distanceToBottom = this.viewport.measureScrollOffset('bottom');
    if (distanceToBottom <= 10) {
      this.store.dispatch(
        pexelsActions.loadSearchPhotos({
          query: this.value,
          perPage: this.batchSize,
        }),
      );
    }
  }

  trackBy(index: number) {
    return index;
  }
}
