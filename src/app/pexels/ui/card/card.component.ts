import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  inject,
  input,
  signal,
} from '@angular/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  photographer = input.required<string>();
  src = input.required<string>();
  srcDownload = input.required<string>();
  alt = input.required<string>();
  url = input.required<string>();
  protected loaded = signal<boolean>(false);

  protected downloadImage(): void {
    const imageUrl = this.srcDownload();
    this.http
      .get(imageUrl, { responseType: 'blob' })
      .pipe(take(1))
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = this.renderer.createElement('a');
        this.renderer.setAttribute(link, 'href', url);
        this.renderer.setAttribute(
          link,
          'download',
          this.extractFileNameFromUrl(imageUrl),
        );
        this.renderer.setStyle(link, 'display', 'none');
        this.renderer.appendChild(document.body, link);
        link.click();
        this.renderer.removeChild(document.body, link);
        window.URL.revokeObjectURL(url);
      });
  }

  private extractFileNameFromUrl(url: string): string {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment;
  }
}
