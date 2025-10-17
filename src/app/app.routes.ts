import { Routes } from '@angular/router';
import { NewsList } from './features/news/news-list/news-list';
import { AuthGuard } from './auth/auth.guard';
import { Login } from './features/login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: NewsList,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
