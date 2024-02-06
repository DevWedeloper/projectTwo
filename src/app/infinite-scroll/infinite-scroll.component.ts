import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  imports: [],
  templateUrl: './infinite-scroll.component.html',
  styleUrl: './infinite-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollComponent {

}
