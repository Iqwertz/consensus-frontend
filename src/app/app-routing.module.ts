import { SuccessComponent } from './pages/success/success.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './pages/create/create.component';
import { PolldataComponent } from './pages/polldata/polldata.component';
import { PollComponent } from './pages/poll/poll.component';
import { PollNotFoundComponent } from './pages/poll-not-found/poll-not-found.component';

const routes: Routes = [
  {
    path: 'poll',
    component: PollComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'polldata',
    component: PolldataComponent,
  },
  {
    path: 'notfound',
    component: PollNotFoundComponent,
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
