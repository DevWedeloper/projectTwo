import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/data-access/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'projectTwo';
  private ts = inject(ThemeService);

  constructor() {
    afterNextRender(() => {
      this.ts.checkPreferredTheme();
    });
  }
}
