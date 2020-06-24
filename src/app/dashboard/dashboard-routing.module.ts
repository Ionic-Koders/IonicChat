import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'list',
        children: [
          {
            path: '',
            loadChildren: () => import('../list/list.module').then(m => m.ListPageModule)
          }
        ]
      },
      {
        path: 'make',
        children: [
          {
            path: '',
            loadChildren: () => import('../make/make.module').then(m => m.MakePageModule)
          }
        ]
      },
      {
        path: 'logout',
        children: [
          {
            path: '',
            loadChildren: () => import('../logout/logout.module').then(m => m.LogoutPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
