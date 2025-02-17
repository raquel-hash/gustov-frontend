import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { SaleComponent } from './components/sale/sale.component';
import { DishComponent } from './components/dish/dish.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { DailySalesReportComponent } from './components/daily-sales-report/daily-sales-report.component';

export const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'User'] },
  },
  {
    path: 'dishes',
    component: DishComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'sale',
    component: SaleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'User'] },
  },
  {
    path: 'daily-sales-report',
    component: DailySalesReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'User'] },
  },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
