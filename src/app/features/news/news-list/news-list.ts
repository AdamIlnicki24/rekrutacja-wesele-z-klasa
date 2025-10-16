import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { News } from '../../../shared/interfaces/news';
import { NewsService } from '../news.service';
import { FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE } from '../../../shared/constants/errorMessages';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, Header],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
  standalone: true,
})
export class NewsList implements OnInit {
  news = signal<News[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.newsService
      .getNews()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (list) => {
          if (!Array.isArray(list)) {
            this.errorMessage.set(FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE);
            return;
          }

          try {
            const sorted = [...list].sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            this.news.set(sorted);
          } catch (err) {
            this.errorMessage.set(FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE);
          }
        },
        error: () => {
          this.errorMessage.set(FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE);
        },
      });
  }
}
