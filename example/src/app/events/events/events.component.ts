import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/internal/operators';
import { AutoSubscription, AutoSubscriptions } from 'auto-subscriptions';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
@AutoSubscriptions()
export class EventsComponent implements OnInit, OnDestroy {
  counts = { click: 0, space: 0, mousemove: 0, mousewheel: 0 };

  @AutoSubscription
  onClick$ = fromEvent(window, 'click')
    .pipe(
      tap(() => this.counts.click = this.counts.click + 1)
    );

  @AutoSubscription
  space$ = fromEvent(window, 'keypress')
    .pipe(
      filter(($event: KeyboardEvent) => $event.code === 'Space'),
      tap(() => this.counts.space = this.counts.space + 1)
    );


  @AutoSubscription
  mousemove$ = fromEvent(window, 'mousemove')
    .pipe(
      tap(() => this.counts.mousemove = this.counts.mousemove + 1)
    );


  @AutoSubscription
  mousewheel$ = fromEvent(window, 'mousewheel')
    .pipe(
      tap(() => this.counts.mousewheel = this.counts.mousewheel + 1)
    );

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


}
