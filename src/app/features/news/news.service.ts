import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../../shared/interfaces/news';
import { NEWS_API_ENDPOINT } from '../../shared/constants/apiEndpoints';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    console.log('Pobrano newsy');
    return this.http.get<News[]>(NEWS_API_ENDPOINT);
  }
}
