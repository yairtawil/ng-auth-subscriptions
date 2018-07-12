import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { MatBadgeModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatBadgeModule
  ],
  declarations: [TimerComponent],
  exports: [TimerComponent]
})
export class TimerModule { }
