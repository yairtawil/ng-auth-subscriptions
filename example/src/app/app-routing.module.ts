import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events/events.component';
import { TimerComponent } from './timer/timer/timer.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  },
  {
    path: 'timer',
    component: TimerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
