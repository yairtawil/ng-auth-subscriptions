import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events/events.component';
import { MatBadgeModule, MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    EventsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  declarations: [EventsComponent],
  exports: [EventsComponent]
})
export class EventsModule {
}
