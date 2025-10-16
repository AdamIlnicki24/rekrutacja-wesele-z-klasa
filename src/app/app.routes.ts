import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { NewsList } from './features/news/news-list/news-list';
import { AuthGuard } from './features/auth/auth.guard';

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
