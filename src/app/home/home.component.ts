import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject, map, mergeMap, scan, throttleTime } from 'rxjs';

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
  protected value = '';
  private batchSize = 15;
  protected theEnd = false;
  private offset = new Subject<void>();
  protected infinite: Observable<any[]>;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor() {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap((n) => this.getBatch(n)),
      scan<{ id: number; name: string }[], { id: number; name: string }[]>(
        (acc, batch) => {
          return [...acc, ...batch];
        },
        [],
      ),
    );

    this.infinite = batchMap.pipe(map((v) => Object.values(v)));
  }

  getBatch(offset: any) {
    return new Observable<{ id: number; name: string }[]>((observer) => {
      setTimeout(() => {
        const start = offset || 0;
        const end = start + this.batchSize;
        const batch = Array.from({ length: this.batchSize }).map((_, i) => ({
          id: start + i,
          name: `Item #${start + i}`,
          query: this.value,
        }));

        observer.next(batch);
        if (this.value === 'test') {
          this.theEnd = true;
        } else if (end >= 100) {
          this.theEnd = true;
        }

        observer.complete();
      }, 1000);
    });
  }

  getNextBatch() {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (end === total) {
      this.offset.next();
    }
  }

  trackBy(index: number) {
    return index;
  }
}
