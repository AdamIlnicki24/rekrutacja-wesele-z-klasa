import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { News } from '../../../shared/interfaces/news';
import { NewsService } from '../news.service';
import { FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE } from '../../../shared/constants/errorMessages';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, Header],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
  standalone: true,
})
export class NewsList implements OnInit {
  news: News[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (list) => {
        this.news = [...list].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = FAILED_TO_DOWNLOAD_NEWS_ERROR_MESSAGE;
        this.isLoading = false;
      },
    });
  }
}
