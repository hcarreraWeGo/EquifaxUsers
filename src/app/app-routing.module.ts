import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { content } from "./shared/routes/routes";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'simple-page/first-page',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '',
    component: ContentComponent,
    children: content
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
